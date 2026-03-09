import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { AnyBlock } from "@/types/block";
import { useBoardStore } from "@/store/board";

const initialState: AnyBlock[] = [
  {
    id: "1",
    type: "note",
    boardId: "default",
    x: 100,
    y: 150,
    props: {
      content:
        "A workspace that feels like a developer’s notebook, but acts like a powerful visual architect. Speed over formality.",
    },
  },
  {
    id: "2",
    type: "code",
    boardId: "default",
    x: 900,
    y: 120,
    props: {
      title: "auth-provider.js",
      lang: "javascript",
      inlineCode: `export const useAuth = () => {
  const [user, setUser] = useState(null)
  const login = (credentials) => {
    return api.post('/auth/login', credentials)
  }
}
      `,
    },
  },
  {
    id: "3",
    type: "image",
    boardId: "default",
    x: 400,
    y: 150,
    props: {
      title: "mount-fuji.jpeg",
      href: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  {
    id: "4",
    type: "bookmark",
    boardId: "default",
    x: 120,
    y: 400,
    props: {
      title: "facebook/react",
      content:
        "A declarative, efficient, and flexible JavaScript library for building user interfaces",
      href: "https://github.com/facebook/react",
      imageUrl:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop",
    },
  },
  {
    id: "5",
    type: "sticky",
    boardId: "default",
    x: 700,
    y: 400,
    props: {
      title: "User-centric",
      content: "Focus on user experience and fast feedback",
    },
  },
];

export const useBlockStore = defineStore(
  "block",
  () => {
    const blocks = ref(initialState);
    const selected = ref<string | null>(null);

    const currentBoardBlocks = computed(() => {
      const boardId = useBoardStore().currentBoardId;
      return blocks.value.filter((block) => block.boardId === boardId);
    });

    const appendBlock = (newBlock: AnyBlock) => {
      const boardId = useBoardStore().currentBoardId;
      const blockWithBoard = {
        ...newBlock,
        boardId: newBlock.boardId ?? boardId,
        updatedAt: new Date(),
      };
      blocks.value = [...blocks.value, blockWithBoard];
      selected.value = blockWithBoard.id;
    };

    const removeSelectedBlock = () => {
      if (!selected.value) return null;

      const removedBlockId = selected.value;

      blocks.value = blocks.value.filter(
        (block) => block.id !== selected.value,
      );
      selected.value = null;

      return removedBlockId;
    };

    const updateBlock = (updates: Partial<AnyBlock>) => {
      const targetId = updates.id ?? selected.value;
      if (!targetId) return;

      const block = blocks.value.find((b) => b.id === targetId);
      if (!block) return;

      if (updates.props) {
        block.props = { ...block.props, ...updates.props };
      }
      if (updates.x !== undefined) block.x = updates.x;
      if (updates.y !== undefined) block.y = updates.y;
      block.updatedAt = new Date();
    };

    const unselect = () => {
      selected.value = null;
    };

    return {
      blocks,
      currentBoardBlocks,
      selected,
      unselect,
      appendBlock,
      updateBlock,
      removeSelectedBlock,
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
  },
);
