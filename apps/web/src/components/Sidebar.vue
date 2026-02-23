<script lang="ts" setup>
import {
  LayoutDashboard,
  Users,
  FileText,
  Archive,
  Plus,
  ChevronLeft,
  Sparkles
} from 'lucide-vue-next';
import { ref } from 'vue';

const recent = ref(['Project Phoenix', 'Auth Flow 2.0', 'Landing Page V3'])
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-container">
      <div class="sidebar-top-section">

        <div class="sidebar-header">
          <div class="brand-group">
            <div class="brand-icon">
              <Sparkles :size="20" fill="currentColor" />
            </div>
            <div class="brand-text">
              <h1 class="brand-title">Ideation Space</h1>
              <p class="brand-subtitle">Pro Workspace</p>
            </div>
          </div>
          <button class="mobile-close-btn">
            <ChevronLeft :size="16" />
          </button>
        </div>

        <nav class="main-nav">
          <NavItem label="My Boards" :active="true">
            <LayoutDashboard :size="18" />
          </NavItem>
          <NavItem label="Shared with Me">
            <Users :size="18" />
          </NavItem>
          <NavItem label="Templates">
            <FileText :size="18" />
          </NavItem>
          <NavItem label="Archive">
            <Archive :size="18" />
          </NavItem>
        </nav>

        <div class="recent-section">
          <p class="section-label">Recent</p>
          <div class="recent-list">
            <div class="recent-item" v-for="recentItem in recent">{{ recentItem }}</div>
          </div>
        </div>
      </div>

      <button class="button-new-board">
        <Plus :size="18" />
        <span>New Board</span>
      </button>
    </div>
  </aside>
</template>

<style lang="css" scoped>
.sidebar {
  width: 16rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: var(--layer-1);
  background: var(--gray-1);
  border-inline-end: var(--border-size-1) solid var(--gray-3);

  animation: var(--animation-slide-in-left);
}

.sidebar-container {
  padding: var(--size-6);
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.sidebar-top-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-group {
  display: flex;
  gap: var(--size-2);
  align-items: center;
}

.brand-icon {
  --shadow-color: var(--blue-3);
  background: var(--blue-4);
  color: white;
  padding: var(--size-2);
  border-radius: var(--radius-2);
  box-shadow: 0 0 #0000,
    0 0 #0000,
    0 10px 15px -3px var(--shadow-color),
    0 4px 6px -4px var(--shadow-color);
}

.brand-title {
  font-size: var(--font-size-1);
  font-weight: var(--font-weight-7);
  line-height: var(--font-lineheight-1);
}

.brand-subtitle {
  color: var(--gray-7);
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-5);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-3);
}

/* Navigation */
.main-nav {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
}

.recent-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
  margin-block-start: var(--size-3);
}

.section-label {
  padding-inline: var(--size-2);
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-3);
  color: var(--gray-6);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
  padding-inline: var(--size-2);
}

.recent-item {
  font-size: var(--font-size-1);
  line-height: var(--font-lineheight-1);
  color: var(--gray-7);
  cursor: pointer;
  padding-block: var(--size-1);
  transition: color 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: var(--blue-4);
  }
}

.button-new-board {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-2);
  border-radius: var(--radius-3);
  padding-inline: var(--size-3);
  background: var(--blue-4);
  color: var(--gray-0);
  line-height: var(--font-lineheight-1);
  font-size: var(--font-size-1);
  font-weight: var(--font-weight-7);
  height: var(--size-9);
  border: none;
  box-shadow: 0 0 #0000,
    0 0 #0000,
    0 10px 15px -3px var(--blue-3),
    0 4px 6px -4px var(--blue-3);
  cursor: pointer;
  transition: transform 120ms ease;

  &:hover {
    background-color: color-mix(in srgb, var(--blue-4) 90%, #fff 10%);
  }

  &:active {
    transform: scale(0.95);
  }
}

.mobile-close-btn {
  display: none;
}

@media (max-width: 1024px) {
  .mobile-close-btn {
    display: block;
    padding: var(--size-1);
    border-radius: var(--radius-1);
  }

  .mobile-close-btn:hover {
    background: var(--slate-1);
  }
}
</style>