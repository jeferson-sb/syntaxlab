import { ref } from "vue";
import { defineStore } from "pinia";
import type { Board } from "@/types/canvasBoard";
import { slugify } from "@/lib/slugify";
import { uniqueId } from "@/lib/uniqueId";

export type BoardWithId = Board & { id: string };

export const useBoardStore = defineStore(
  "board",
  () => {
    const boards = ref<BoardWithId[]>([
      {
        id: "default",
        name: "My First Board",
        visibility: "private",
        projectId: "default-project",
      },
    ]);
    const currentBoardId = ref<string>("default");
    const isCreateDialogOpen = ref(false);

    const currentBoard = () =>
      boards.value.find((b) => b.id === currentBoardId.value);

    const createBoard = (board: Board) => {
      const newBoard: BoardWithId = {
        ...board,
        id: `${slugify(board.name)}-${uniqueId().slice(0, 8)}`,
      };
      boards.value.push(newBoard);
      currentBoardId.value = newBoard.id;
      return newBoard;
    };

    const deleteBoard = (id: string) => {
      const index = boards.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        boards.value.splice(index, 1);
        if (currentBoardId.value === id && boards.value.length > 0) {
          currentBoardId.value = boards.value[0]!.id;
        }
      }
    };

    const updateBoard = (id: string, updates: Partial<Board>) => {
      const board = boards.value.find((b) => b.id === id);
      if (board) {
        Object.assign(board, updates);
      }
    };

    const openCreateDialog = () => {
      isCreateDialogOpen.value = true;
    };

    const closeCreateDialog = () => {
      isCreateDialogOpen.value = false;
    };

    return {
      boards,
      currentBoardId,
      currentBoard,
      createBoard,
      deleteBoard,
      updateBoard,
      isCreateDialogOpen,
      openCreateDialog,
      closeCreateDialog,
    };
  },
  {
    storage: {
      adapter: "localStorage",
      namespace: "syntaxlab",
    },
  },
);
