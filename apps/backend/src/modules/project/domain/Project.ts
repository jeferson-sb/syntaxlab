import { Board } from "@/modules/board/domain/Board";
import { AggregateId, AggregateRoot } from "@/shared/domain/AggregateRoot";
import { Repository } from "@/shared/domain/Repository";

type UserId = AggregateId<string>;
export type Project = AggregateRoot<ProjectId> & {
  name: string;
  userId: UserId;
  boards: Board[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectId = AggregateId<string>;

export type ProjectRepository = Repository<Project>;

export const createProject = (
  props: Omit<Project, "createdAt" | "updatedAt">
): Project => ({
  id: props.id,
  name: props.name,
  userId: props.userId,
  boards: props.boards,
  createdAt: new Date(),
  updatedAt: new Date(),
});
