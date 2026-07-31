import { computed, ref } from "vue"
import { defineStore } from "pinia"

import type { AnyBlock } from "@/types/block"
import { useBoardStore } from "@/store/board"
import { useConnectionStore } from "@/store/connection"
import { useHistoryStore } from "@/store/history"
import { uniqueId } from "@/lib/uniqueId"

const DUPLICATE_OFFSET = 20

const initialState: AnyBlock[] = [
  {
    id: "1",
    type: "sticky",
    boardId: "default",
    x: 131.35,
    y: 33.62,
    props: {
      title: "🎯 Sprint Goal",
      content: "Build user authentication with JWT tokens and refresh flow",
      color: "#fef9c3",
    },
  },
  {
    id: "2",
    type: "note",
    boardId: "default",
    x: 93.246,
    y: 410.52,
    props: {
      content:
        "## Auth Flow\n1. User submits credentials\n2. Server validates & returns JWT + refresh token\n3. Store tokens in httpOnly cookies\n4. Auto-refresh before expiry",
      textSize: "md",
    },
  },
  {
    id: "3",
    type: "code",
    boardId: "default",
    x: 867.21,
    y: 0.292,
    props: {
      title: "auth.ts",
      lang: "typescript",
      inlineCode: `export async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  })
  return res.json()
}`,
    },
  },
  {
    id: "4",
    type: "bookmark",
    boardId: "default",
    x: 1247.17,
    y: 469.56,
    props: {
      title: "JWT Best Practices - Auth0",
      content:
        "Learn about token storage, rotation, and security considerations",
      href: "https://auth0.com/docs/secure/tokens/json-web-tokens",
      imageUrl:
        "https://cdn.auth0.com/website/assets/pages/homepage/img/hero/developers-e3a7b6aba0.png",
    },
  },
  {
    id: "5",
    type: "sticky",
    boardId: "default",
    x: 735.35,
    y: 436.05,
    props: {
      title: "⚠️ Security Notes",
      content:
        "Never store JWT in localStorage. Use httpOnly cookies + CSRF protection.",
      color: "#f3e8ff",
    },
  },
]

export const useBlockStore = defineStore(
  "block",
  () => {
    const blocks = ref(initialState)
    const selected = ref<string | null>(null)

    const currentBoardBlocks = computed(() => {
      const boardId = useBoardStore().currentBoardId
      return blocks.value.filter((block) => block.boardId === boardId)
    })

    const appendBlock = (newBlock: AnyBlock) => {
      const boardId = useBoardStore().currentBoardId
      const blockWithBoard = {
        ...newBlock,
        boardId: newBlock.boardId ?? boardId,
        updatedAt: new Date(),
      }
      blocks.value = [...blocks.value, blockWithBoard]
      selected.value = blockWithBoard.id

      useHistoryStore().recordChange(
        blockWithBoard.boardId,
        blockWithBoard.id,
        null,
        useHistoryStore().snapshot(blockWithBoard),
      )
    }

    const removeSelectedBlock = () => {
      if (!selected.value) return null

      const removedBlock = blocks.value.find((b) => b.id === selected.value)
      if (!removedBlock) return null

      const historyStore = useHistoryStore()
      const removedSnapshot = historyStore.snapshot(removedBlock)
      const relatedConnections = useConnectionStore()
        .connections.filter(
          (c) =>
            c.fromBlockId === removedBlock.id ||
            c.toBlockId === removedBlock.id,
        )
        .map((c) => historyStore.snapshot(c))

      blocks.value = blocks.value.filter((block) => block.id !== selected.value)
      selected.value = null

      historyStore.recordChange(
        removedSnapshot.boardId ?? useBoardStore().currentBoardId,
        removedSnapshot.id,
        removedSnapshot,
        null,
        relatedConnections,
      )

      return removedSnapshot.id
    }

    const updateBlock = (updates: Partial<AnyBlock>) => {
      const targetId = updates.id ?? selected.value
      if (!targetId) return

      const block = blocks.value.find((b) => b.id === targetId)
      if (!block) return

      const historyStore = useHistoryStore()
      const before = historyStore.snapshot(block)

      if (updates.props) {
        block.props = { ...block.props, ...updates.props }
      }
      if (updates.x !== undefined) block.x = updates.x
      if (updates.y !== undefined) block.y = updates.y
      block.updatedAt = new Date()

      const onlyAiPreviewChanged =
        updates.props &&
        updates.x === undefined &&
        updates.y === undefined &&
        Object.keys(updates.props).every((key) => key === "aiPreview")

      if (!onlyAiPreviewChanged) {
        historyStore.recordChange(
          block.boardId ?? useBoardStore().currentBoardId,
          block.id,
          before,
          historyStore.snapshot(block),
        )
      }
    }

    const duplicateSelected = () => {
      if (!selected.value) return null

      const source = blocks.value.find((b) => b.id === selected.value)
      if (!source) return null

      const duplicate: AnyBlock = {
        ...useHistoryStore().snapshot(source),
        id: uniqueId(),
        _syncId: undefined,
        x: source.x + DUPLICATE_OFFSET,
        y: source.y + DUPLICATE_OFFSET,
      }

      appendBlock(duplicate)
      return duplicate.id
    }

    const unselect = () => {
      selected.value = null
    }

    return {
      blocks,
      currentBoardBlocks,
      selected,
      unselect,
      appendBlock,
      updateBlock,
      removeSelectedBlock,
      duplicateSelected,
    }
  },
  {
    storage: {
      adapter: "indexedDB",
      options: {
        dbName: "syntaxlab",
        storeName: "root",
      },
    },
  },
)
