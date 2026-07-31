import { toRaw } from "vue"
import { defineStore } from "pinia"

import type { AnyBlock } from "@/types/block"
import type { Connection } from "@/types/connection"
import { useBlockStore } from "@/store/block"
import { useConnectionStore } from "@/store/connection"

type HistoryEntry = {
  blockId: string
  before: AnyBlock | null
  after: AnyBlock | null
  connections?: Connection[]
  timestamp: number
}

type BoardHistory = {
  undo: HistoryEntry[]
  redo: HistoryEntry[]
}

const COALESCE_WINDOW_MS = 800

const clone = <T>(value: T): T => structuredClone(toRaw(value))

export const useHistoryStore = defineStore("history", () => {
  // Plain (non-reactive) Map: nothing in the UI observes the stack contents
  // (undo/redo/duplicate are always enabled, see design decision), and
  // wrapping it in Vue's reactive() would re-proxy the already-cloned
  // snapshots on every read, which structuredClone cannot handle.
  const perBoard = new Map<string, BoardHistory>()

  const getStack = (boardId: string): BoardHistory => {
    let stack = perBoard.get(boardId)
    if (!stack) {
      stack = { undo: [], redo: [] }
      perBoard.set(boardId, stack)
    }
    return stack
  }

  const recordChange = (
    boardId: string,
    blockId: string,
    before: AnyBlock | null,
    after: AnyBlock | null,
    connections?: Connection[],
  ) => {
    const stack = getStack(boardId)
    const top = stack.undo[stack.undo.length - 1]

    if (
      top &&
      top.blockId === blockId &&
      !top.connections &&
      !connections &&
      Date.now() - top.timestamp < COALESCE_WINDOW_MS
    ) {
      top.after = after
      top.timestamp = Date.now()
    } else {
      stack.undo.push({
        blockId,
        before,
        after,
        connections,
        timestamp: Date.now(),
      })
    }

    stack.redo = []
  }

  const applySnapshot = (blockId: string, target: AnyBlock | null) => {
    const blockStore = useBlockStore()
    const idx = blockStore.blocks.findIndex((b) => b.id === blockId)

    if (target === null) {
      if (idx !== -1) blockStore.blocks.splice(idx, 1)
      return
    }

    const existing = idx === -1 ? undefined : blockStore.blocks[idx]

    if (!existing) {
      blockStore.blocks.push(clone(target))
    } else {
      // Mutate the existing block object in place (rather than replacing the
      // array element) so components holding a reference to it — e.g.
      // BlockRenderer.vue, which destructures the `block` prop into a local
      // const — see the change reflected instead of pointing at a stale object.
      Object.assign(existing, clone(target))
    }
  }

  const restoreConnections = (connections: Connection[]) => {
    const connectionStore = useConnectionStore()
    connections.forEach((connection) => {
      const exists = connectionStore.connections.some(
        (c) => c.id === connection.id,
      )
      if (!exists) connectionStore.connections.push(clone(connection))
    })
  }

  const removeConnections = (connections: Connection[]) => {
    const connectionStore = useConnectionStore()
    const ids = new Set(connections.map((c) => c.id))
    connectionStore.connections = connectionStore.connections.filter(
      (c) => !ids.has(c.id),
    )
  }

  const undo = (boardId: string) => {
    const stack = getStack(boardId)
    const entry = stack.undo.pop()
    if (!entry) return

    applySnapshot(entry.blockId, entry.before)
    if (entry.connections) restoreConnections(entry.connections)

    stack.redo.push(entry)
  }

  const redo = (boardId: string) => {
    const stack = getStack(boardId)
    const entry = stack.redo.pop()
    if (!entry) return

    applySnapshot(entry.blockId, entry.after)
    if (entry.connections) removeConnections(entry.connections)

    stack.undo.push(entry)
  }

  return {
    recordChange,
    undo,
    redo,
    snapshot: clone,
  }
})
