import type {
  ProjectRepository,
  UserId,
} from "@/modules/project/domain/Project";

type UpdateProjectDTO = {
  name: string;
  userId: UserId;
};

export const makeUpdateProject =
  ({ projectRepository }: { projectRepository: ProjectRepository }) =>
  async (payload: Partial<UpdateProjectDTO>) => {
    await projectRepository.update(payload);
  };
