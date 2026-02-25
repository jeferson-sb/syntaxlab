import type {
  Project,
  ProjectId,
  ProjectRepository,
} from "@/modules/project/domain/Project";

export class InMemoryProjectRepository implements ProjectRepository {
  private projects = new Map<string, Project>();
  private nextId = 1;

  async getNextId(): Promise<ProjectId> {
    return { value: `project-${this.nextId++}` };
  }

  async store(entity: Project): Promise<void> {
    this.projects.set(entity.id.value, { ...entity });
  }

  async index(): Promise<Project[]> {
    return [...this.projects.values()].map((project) => ({ ...project }));
  }

  async get(id: ProjectId): Promise<Project> {
    const project = this.projects.get(id.value);

    if (!project) throw new Error("Project not found");

    return { ...project };
  }

  async update(entity: Partial<Project>): Promise<void> {
    const projectId = entity.id?.value;

    if (!projectId) throw new Error("Project id is required");

    const currentProject = this.projects.get(projectId);

    if (!currentProject) throw new Error("Project not found");

    this.projects.set(projectId, {
      ...currentProject,
      ...entity,
      updatedAt: new Date(),
    });
  }

  async addBoard(projectId: ProjectId, boards: string[]): Promise<void> {
    const currentProject = this.projects.get(projectId.value);

    if (!currentProject) throw new Error("Project not found");

    const currentBoards = (currentProject.boards ?? []) as unknown as Array<
      { id?: { value: string } } | string
    >;

    const currentBoardIds = currentBoards.map((board) =>
      typeof board === "string" ? board : board.id?.value,
    );

    const mergedBoardIds = [
      ...new Set([...currentBoardIds.filter(Boolean), ...boards]),
    ] as string[];

    this.projects.set(projectId.value, {
      ...currentProject,
      boards: mergedBoardIds as unknown as Project["boards"],
      updatedAt: new Date(),
    });
  }

  async delete(id: ProjectId): Promise<void> {
    if (!this.projects.has(id.value)) throw new Error("Project not found");

    this.projects.delete(id.value);
  }
}
