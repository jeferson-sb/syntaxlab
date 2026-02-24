import { ref } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

import type { AnyBlock } from "@/types/block";

const initialState: AnyBlock[] = [
  {
    id: "1",
    type: "note",
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
    x: 700,
    y: 400,
    props: {
      title: "User-centric",
      content: "Focus on user experience and fast feedback",
    },
  },
];

export const useBlockStore = defineStore("block", () => {
  const blocks = ref(initialState);
  const selected = ref<string | null>(null);
  const connections = ref([]);

  const appendBlock = (newBlock: AnyBlock) => {
    blocks.value.push(newBlock);
    selected.value = newBlock.id;
  };

  const removeSelectedBlock = () => {
    if (!selected.value) return;

    blocks.value = blocks.value.filter((block) => block.id !== selected.value);
  };

  const updateBlock = (updates: Partial<AnyBlock>) => {
    if (!selected.value) return;

    blocks.value = blocks.value.map((blck) => {
      const patch = updates?.props
        ? { ...blck, props: { ...blck.props, ...updates.props } }
        : { ...blck, ...updates };
      return blck.id === selected.value ? patch : blck;
    });
  };

  const unselect = () => {
    selected.value = null;
  };

  return {
    blocks,
    connections,
    selected,
    unselect,
    appendBlock,
    updateBlock,
    removeSelectedBlock,
  };
});

// TODO: subscribe to localstorage
// useBlockStore().$subscribe(() => {})
