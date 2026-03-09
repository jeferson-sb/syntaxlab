import type {
  Project,
  ProjectId,
  ProjectRepository,
  ProjectUpsertInput,
} from "@/modules/project/domain/Project";
import type { UpsertResult } from "@/shared/domain/UpsertResult";

export class InMemoryProjectRepository implements ProjectRepository {
  private projects = new Map<string, Project & { clientRef?: string }>();
  private clientRefIndex = new Map<string, string>();
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

    const project = this.projects.get(id.value);
    if (project?.clientRef) {
      this.clientRefIndex.delete(project.clientRef);
    }
    this.projects.delete(id.value);
  }

  async batchUpsert(entities: ProjectUpsertInput[]): Promise<UpsertResult[]> {
    const results: UpsertResult[] = [];

    for (const input of entities) {
      const existingId = this.clientRefIndex.get(input.clientRef);
      const existing = existingId ? this.projects.get(existingId) : undefined;

      if (existing) {
        const existingUpdatedAt = existing.updatedAt?.getTime() ?? 0;
        const inputUpdatedAt = new Date(input.updatedAt).getTime();

        if (inputUpdatedAt <= existingUpdatedAt) {
          results.push({
            clientRef: input.clientRef,
            serverId: existing.id.value,
            action: "skipped",
          });
          continue;
        }

        this.projects.set(existing.id.value, {
          ...existing,
          name: input.name,
          userId: input.userId,
          updatedAt: new Date(input.updatedAt),
        });

        results.push({
          clientRef: input.clientRef,
          serverId: existing.id.value,
          action: "updated",
        });
      } else {
        const id = await this.getNextId();
        const newProject: Project & { clientRef: string } = {
          id,
          name: input.name,
          userId: input.userId,
          boards: input.boards,
          clientRef: input.clientRef,
          createdAt: new Date(input.updatedAt),
          updatedAt: new Date(input.updatedAt),
        };

        this.projects.set(id.value, newProject);
        this.clientRefIndex.set(input.clientRef, id.value);

        results.push({
          clientRef: input.clientRef,
          serverId: id.value,
          action: "created",
        });
      }
    }

    return results;
  }
}
