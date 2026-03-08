import { ref, computed } from "vue";
import { defineStore } from "pinia";

import { uniqueId } from "@/lib/uniqueId";
import type { Connection } from "@/types/connection";
import { useBlockStore } from "@/store/block";

type CreateConnectionInput = {
  fromBlockId: string;
  toBlockId: string;
};

type InteractionMode = "link" | "unlink" | null;

const initialState: Connection[] = [
  { id: "1", fromBlockId: "1", toBlockId: "2" },
  { id: "2", fromBlockId: "2", toBlockId: "3" },
];

export const useConnectionStore = defineStore(
  "connection",
  () => {
    const connections = ref<Connection[]>(initialState);
    const interactionMode = ref<InteractionMode>(null);

    const isLinkModeActive = interactionMode.value === "link";
    const isUnlinkModeActive = interactionMode.value === "unlink";
    const linkSourceBlockId = ref<string | null>(null);
    const statusMessage = ref("");

    const currentBoardConnections = computed(() => {
      const visibleBlockIds = new Set(
        useBlockStore().currentBoardBlocks.map((b) => b.id)
      );
      return connections.value.filter(
        (c) =>
          visibleBlockIds.has(c.fromBlockId) && visibleBlockIds.has(c.toBlockId)
      );
    });

    const clearStatus = () => {
      statusMessage.value = "";
    };

    const setStatus = (message: string) => {
      statusMessage.value = message;
    };

    const hasDuplicateConnection = (fromBlockId: string, toBlockId: string) => {
      return connections.value.some(
        (connection) =>
          connection.fromBlockId === fromBlockId &&
          connection.toBlockId === toBlockId
      );
    };

    const canCreateConnection = ({
      fromBlockId,
      toBlockId,
    }: CreateConnectionInput): { ok: boolean; reason?: string } => {
      if (fromBlockId === toBlockId) {
        return { ok: false, reason: "You can’t link a block to itself." };
      }

      if (hasDuplicateConnection(fromBlockId, toBlockId)) {
        return {
          ok: false,
          reason: "This connection already exists. Press backspace to unlink",
        };
      }

      return { ok: true };
    };

    const createConnection = ({
      fromBlockId,
      toBlockId,
    }: CreateConnectionInput) => {
      const validation = canCreateConnection({ fromBlockId, toBlockId });

      if (!validation.ok) {
        if (validation.reason) setStatus(validation.reason);
        return false;
      }

      connections.value.push({
        id: uniqueId(),
        fromBlockId,
        toBlockId,
      });
      clearStatus();
      return true;
    };

    const beginLinkMode = (sourceBlockId: string | null) => {
      interactionMode.value = "link";
      linkSourceBlockId.value = sourceBlockId;

      if (sourceBlockId) {
        setStatus("Select a target block.");
        return;
      }

      setStatus("Select the source block.");
    };

    const beginUnlinkMode = (sourceBlockId: string | null) => {
      interactionMode.value = "unlink";
      linkSourceBlockId.value = sourceBlockId;

      if (sourceBlockId) {
        setStatus("Unlink the connected target block.");
        return;
      }

      setStatus("Unlink the source block.");
    };

    const cancelLinkMode = () => {
      interactionMode.value = null;
      linkSourceBlockId.value = null;
      clearStatus();
    };

    const toggleLinkMode = (selectedBlockId: string | null) => {
      if (interactionMode.value === "link") {
        cancelLinkMode();
        return;
      }

      beginLinkMode(selectedBlockId);
    };

    const toggleUnlinkMode = (selectedBlockId: string | null) => {
      if (interactionMode.value === "unlink") {
        cancelLinkMode();
        return;
      }

      beginUnlinkMode(selectedBlockId);
    };

    const removeConnectionBetweenBlocks = (
      fromBlockId: string,
      toBlockId: string
    ) => {
      if (fromBlockId === toBlockId) {
        setStatus("Select two different blocks to remove a connection.");
        return false;
      }

      connections.value = connections.value.filter((connection) => {
        const isDirectMatch =
          connection.fromBlockId === fromBlockId &&
          connection.toBlockId === toBlockId;
        const isReverseMatch =
          connection.fromBlockId === toBlockId &&
          connection.toBlockId === fromBlockId;

        return !isDirectMatch && !isReverseMatch;
      });

      return true;
    };

    const toggleBlockLink = (blockId: string) => {
      if (!interactionMode.value) {
        clearStatus();
        return { selectedBlockId: blockId, connectionCreated: false };
      }

      if (!linkSourceBlockId.value) {
        linkSourceBlockId.value = blockId;
        setStatus(
          isUnlinkModeActive
            ? "Source selected. Select target block to remove connection."
            : "Source selected. Select a target block."
        );
        return { selectedBlockId: blockId, connectionCreated: false };
      }

      const sourceId = linkSourceBlockId.value;
      const createdOrRemoved = isUnlinkModeActive
        ? removeConnectionBetweenBlocks(sourceId, blockId)
        : createConnection({
            fromBlockId: sourceId,
            toBlockId: blockId,
          });

      if (createdOrRemoved) {
        interactionMode.value = null;
        linkSourceBlockId.value = null;
      }

      return { selectedBlockId: blockId, connectionCreated: createdOrRemoved };
    };

    const removeConnectionsForBlock = (blockId: string) => {
      connections.value = connections.value.filter(
        (connection) =>
          connection.fromBlockId !== blockId && connection.toBlockId !== blockId
      );
    };

    return {
      connections,
      currentBoardConnections,
      statusMessage,
      interactionMode,
      isLinkModeActive,
      isUnlinkModeActive,
      linkSourceBlockId,
      beginLinkMode,
      cancelLinkMode,
      toggleLinkMode,
      toggleUnlinkMode,
      clearStatus,
      canCreateConnection,
      createConnection,
      removeConnectionBetweenBlocks,
      toggleBlockLink,
      removeConnectionsForBlock,
    };
  },
  {
    storage: {
      adapter: "indexedDB",
      options: {
        dbName: "syntaxlab",
        storeName: "root",
      },
    },
  }
);
