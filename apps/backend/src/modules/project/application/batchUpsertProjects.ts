import type {
  ProjectRepository,
  ProjectUpsertInput,
} from "@/modules/project/domain/Project";

type BatchUpsertProjectsDTO = {
  clientRef: string;
  name: string;
  userId: string;
  updatedAt: string;
}[];

type BatchUpsertProjectsDependencies = {
  projectRepository: ProjectRepository;
};

export const makeBatchUpsertProjects =
  ({ projectRepository }: BatchUpsertProjectsDependencies) =>
  async (payload: BatchUpsertProjectsDTO) => {
    const entities: ProjectUpsertInput[] = payload.map((item) => ({
      clientRef: item.clientRef,
      name: item.name,
      userId: { value: item.userId },
      boards: null,
      updatedAt: new Date(item.updatedAt),
    }));

    return projectRepository.batchUpsert(entities);
  };
