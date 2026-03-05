import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Project } from "@/types/project";
import { useBoardStore } from "./board";
import { slugify } from "@/lib/slugify";
import { uniqueId } from "@/lib/uniqueId";

export type ProjectWithId = Project;

export const useProjectStore = defineStore(
  "project",
  () => {
    const boardStore = useBoardStore();

    const projects = ref<Project[]>([
      {
        id: "default-project",
        name: "My First Project",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const currentProjectId = ref<string>("default-project");

    const currentProject = computed(() =>
      projects.value.find((p) => p.id === currentProjectId.value),
    );

    const projectBoards = computed(() =>
      boardStore.boards.filter((b) => b.projectId === currentProjectId.value),
    );

    const createProject = (name: string) => {
      const newProject: Project = {
        id: `${slugify(name)}-${uniqueId().slice(0, 8)}`,
        name,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      projects.value.push(newProject);
      currentProjectId.value = newProject.id;
      return newProject;
    };

    const deleteProject = (id: string) => {
      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value.splice(index, 1);
        if (currentProjectId.value === id && projects.value.length > 0) {
          currentProjectId.value = projects.value[0]!.id;
        }
      }
    };

    const updateProject = (
      id: string,
      updates: Partial<Omit<Project, "id">>,
    ) => {
      const project = projects.value.find((p) => p.id === id);
      if (project) {
        Object.assign(project, { ...updates, updatedAt: new Date() });
      }
    };

    const setCurrentProject = (id: string) => {
      currentProjectId.value = id;
    };

    const isProjectDialogOpen = ref(false);

    const openProjectDialog = () => {
      isProjectDialogOpen.value = true;
    };

    const closeProjectDialog = () => {
      isProjectDialogOpen.value = false;
    };

    return {
      projects,
      currentProjectId,
      currentProject,
      projectBoards,
      createProject,
      deleteProject,
      updateProject,
      setCurrentProject,
      isProjectDialogOpen,
      openProjectDialog,
      closeProjectDialog,
    };
  },
  {
    storage: {
      adapter: "localStorage",
      namespace: "syntaxlab",
    },
  },
);
