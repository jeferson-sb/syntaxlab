<script lang="ts" setup>
import {
  Plus,
  ChevronLeft,
  LayoutGrid,
  FolderOpen,
  Infinity
} from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useBoardStore } from '@/store/board';
import { useProjectStore } from '@/store/project';
import type { Board } from '@/types/canvasBoard';

type BoardInput = Omit<Board, 'projectId'>;

const boardStore = useBoardStore();
const projectStore = useProjectStore();
const { isCreateDialogOpen, currentBoardId } = storeToRefs(boardStore);
const { currentProject, projectBoards, projects, isProjectDialogOpen, currentProjectId } = storeToRefs(projectStore);

const createBoard = (board: BoardInput) => boardStore.createBoard({
  ...board,
  projectId: projectStore.currentProjectId,
});

const selectBoard = (boardId: string) => {
  boardStore.currentBoardId = boardId;
};

const createProject = (name: string) => {
  projectStore.createProject(name);
};

const selectProject = (projectId: string) => {
  projectStore.setCurrentProject(projectId);
};
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-container">
      <div class="sidebar-top-section">

        <div class="sidebar-header">
          <div class="brand-group">
            <div class="brand-icon">
              <Infinity :size="20" fill="none" />
            </div>
            <div class="brand-text">
              <h1 class="brand-title">SyntaxLab</h1>
              <p class="brand-subtitle">Pro Workspace</p>
            </div>
          </div>
          <button class="mobile-close-btn">
            <ChevronLeft :size="16" />
          </button>
        </div>

        <div class="boards-section">
          <div class="section-header">
            <p class="section-label">{{ currentProject?.name ?? 'Project' }}</p>
            <button type="button" class="project-switch-btn" @click="projectStore.openProjectDialog"
              title="Switch project">
              <FolderOpen :size="14" />
            </button>
          </div>
          <div class="boards-list">
            <button v-for="board in projectBoards" :key="board.id"
              :class="{ active: currentBoardId === board.id, 'board-item': true }" @click="selectBoard(board.id)">
              <LayoutGrid :size="14" />
              <span>{{ board.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <button type="button" class="button-new-board" @click="boardStore.openCreateDialog">
        <Plus :size="18" />
        <span>New Canvas</span>
      </button>

      <CreateBoardDialog v-model:open="isCreateDialogOpen" @create="createBoard" />
      <ProjectDialog v-model:open="isProjectDialogOpen" :projects="projects" :current-project-id="currentProjectId"
        @create="createProject" @select="selectProject" />
    </div>
  </aside>
</template>

<style lang="css" scoped>
.sidebar {
  width: 16rem;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: var(--layer-1);
  background: var(--surface-2);
  border-inline-end: var(--border-size-1) solid var(--border-color);

  /* animation: var(--animation-slide-in-left); */
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
  --shadow-color: light-dark(var(--blue-3), var(--blue-8));

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
  color: var(--text-1);
}

.brand-subtitle {
  color: var(--text-2);
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
  margin: 0;
  padding: 0;
}

.boards-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
  margin-block-start: var(--size-3);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-label {
  padding-inline: var(--size-2);
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-3);
  color: var(--text-3);
}

.project-switch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-1);
  border: none;
  background: transparent;
  color: var(--text-3);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: color 150ms, background-color 150ms;

  &:hover {
    color: var(--blue-4);
    background: var(--surface-3);
  }
}

.boards-list {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
}

.board-item {
  display: flex;
  align-items: center;
  gap: var(--size-2);
  font-size: var(--font-size-1);
  line-height: var(--font-lineheight-1);
  color: var(--text-2);
  cursor: pointer;
  padding: var(--size-2);
  border: none;
  background: transparent;
  border-radius: var(--radius-2);
  text-align: left;
  transition: color 150ms, background-color 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: var(--blue-4);
    background: var(--surface-3);
  }

  &.active {
    color: var(--blue-4);
    background: var(--surface-3);
    font-weight: var(--font-weight-6);
  }
}

.button-new-board {
  --shadow-color: light-dark(var(--blue-3), var(--blue-8));
  --highlight-color: light-dark(var(--blue-4), var(--blue-6));

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
    0 10px 15px -3px var(--shadow-color),
    0 4px 6px -4px var(--shadow-color);
  cursor: pointer;
  transition: transform 120ms ease, background-color 250ms ease;

  &:hover {
    background-color: color-mix(in srgb, var(--highlight-color) 90%, #fff 10%);
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
    color: var(--text-1);
  }

  .mobile-close-btn:hover {
    background: var(--surface-3);
  }
}
</style>