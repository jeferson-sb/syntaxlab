import type {
  ProjectId,
  ProjectRepository,
  UserId,
} from "@/modules/project/domain/Project";

type UpdateProjectDTO = {
  id: ProjectId;
  name: string;
  userId: UserId;
};

export const makeUpdateProject =
  ({ projectRepository }: { projectRepository: ProjectRepository }) =>
  async (payload: Partial<UpdateProjectDTO>) => {
    await projectRepository.update(payload);
  };
