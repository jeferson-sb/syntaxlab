import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { AnyBlock } from "@/types/block";
import { useBoardStore } from "@/store/board";

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
