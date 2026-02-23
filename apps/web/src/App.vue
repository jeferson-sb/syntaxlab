<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { treaty, edenFetch } from '@elysiajs/eden'
import type { App } from 'syntaxlab-backend'
import { useCanvasStore } from '@/store/canvas'

const api = treaty<App>('http://localhost:3000')
const fetch = edenFetch<App>('http://localhost:3000')

// TODO: migrate local state to pinia

const canvasState = useCanvasStore()

const selected = ref(null)
const blocks = ref([
  {
    id: '1',
    type: 'note',
    x: 100,
    y: 150,
    props: {
      title: 'Main Value Prop',
      content: 'A workspace that feels like a developer’s notebook, but acts like a powerful visual architect. Speed over formality.',
    }
  },
  {
    id: '2',
    type: 'code',
    x: 900,
    y: 120,
    props: {
      title: 'auth-provider.js',
      lang: 'javascript',
      inlineCode: `export const useAuth = () => {
  const [user, setUser] = useState(null)
  const login = (credentials) => {
    return api.post('/auth/login', credentials)
  }
}
      `
    }
  },
  {
    id: '3',
    type: 'image',
    x: 400,
    y: 150,
    props: {
      title: 'mount-fuji.jpeg',
      href: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  },
  {
    id: '4',
    type: 'bookmark',
    x: 120,
    y: 400,
    props: {
      title: 'facebook/react',
      content: 'A declarative, efficient, and flexible JavaScript library for building user interfaces',
      href: 'https://github.com/facebook/react',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop'
    }
  },
  {
    id: '5',
    type: 'sticky',
    x: 700,
    y: 400,
    props: {
      title: 'Feature XYZ',
      content: 'A new breaking feature about gamification and user-feedback',
    }
  }
])
const connections = ref([])
const fileInputRef = useTemplateRef('file')

function uniqueId() {
  return Math.floor(Math.random() * 1e15).toString()
}

// TODO: fix typing
const addBlock = (type) => {
  if (type === 'image') {
    fileInputRef.value?.click();
    return;
  }

  const centerX = (-canvasState.offset.x + window.innerWidth / 2) / canvasState.zoom;
  const centerY = (-canvasState.offset.y + window.innerHeight / 2) / canvasState.zoom;

  const newBlock = {
    id: uniqueId(),
    type,
    x: centerX - 100,
    y: centerY - 100,
    props: {
      content: type === 'code' ? '// New snippet' : 'Double click to edit content',
      title: type === 'code' ? 'new_file.js' : 'New Idea',
      color: '#ffffff',
    }
  };
  blocks.value.push(newBlock);
  selected.value = newBlock.id;
};

const updateBlock = (id: string | null, updates: any) => {
  console.log('[updateBlock]', id, updates)
  if (!id) return

  blocks.value = blocks.value.map(blck => {
    const patch = updates?.props ? { ...blck, props: { ...blck.props, ...updates.props } } : { ...blck, ...updates }
    return blck.id === id ? patch : blck
  })
};

const removeBlock = () => {
  if (!selected.value) return

  blocks.value = blocks.value.filter(block => block.id !== selected.value)
};

// TODO: add gemini integration for note/sticky blocks
const aiExpand = () => { }

const onImageUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const imageUrl = event.target?.result as string;
    const centerX = (-canvasState.offset.x + window.innerWidth / 2) / canvasState.zoom;
    const centerY = (-canvasState.offset.y + window.innerHeight / 2) / canvasState.zoom;

    const newBlock = {
      id: uniqueId(),
      type: 'image',
      x: centerX - 150,
      y: centerY - 150,
      props: {
        title: file.name,
        href: imageUrl
      },
    };
    blocks.value.push(newBlock)
    selected.value = newBlock.id
  };
  reader.readAsDataURL(file);
};

</script>

<template>
  <div class="app">
    <Sidebar />

    <div class="shell">
      <Header />

      <input type="file" ref="file" accept="image/*" @change="onImageUpload" hidden />

      <main>
        <Canvas :blocks="blocks" :connections="connections" :selected="selected"
          @update-block="partial => updateBlock(selected, partial)" @select-block="id => selected = id" />
        <Toolbar :selected="selected" @add-block="addBlock" @update-block="partial => updateBlock(selected, partial)"
          @remove-block="removeBlock" @unselect="selected = null" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: var(--gray-2);
  color: var(--gray-9);
  transition: background 200ms ease, color 200ms ease;
  overflow: hidden;
}

.shell {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

main {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
