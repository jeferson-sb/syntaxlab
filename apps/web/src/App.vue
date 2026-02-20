<script setup lang="ts">
import { ref } from 'vue'
import { treaty, edenFetch } from '@elysiajs/eden'
import type { App } from 'syntaxlab-backend'

const api = treaty<App>('http://localhost:3000')
const fetch = edenFetch<App>('http://localhost:3000')

const zoom = ref(1)
const offset = ref({ x: 0, y: 0 })
const selected = ref({ id: '1' })
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

const addBlock = (type) => {
  if (type === 'image') {
    return;
  }

  const centerX = (-offset.value.x + window.innerWidth / 2) / zoom.value;
  const centerY = (-offset.value.y + window.innerHeight / 2) / zoom.value;

  const newBlock = {
    id: Math.random().toString(36).slice(2, 9),
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
  selected.value.id = newBlock.id;
};

</script>

<template>
  <div class="app">
    <Sidebar />

    <div class="shell">
      <Header />

      <main>
        <Canvas :zoom="zoom" :offset="offset" :blocks="blocks" />
        <Toolbar @addBlock="addBlock" @zoomIn="zoom = Math.min(zoom + 0.1, 2.5)"
          @zoomOut="zoom = Math.max(zoom - 0.1, 0.2)" />
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
