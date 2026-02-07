import { AggregateId, AggregateRoot } from "./AggregateRoot";

export type Repository<
  T extends AggregateRoot<any>,
  ID extends AggregateId<any> = T["id"]
> = {
  getNextId(): Promise<ID>;
  store(entity: T): Promise<void>;
  index(): Promise<T[]>;
  delete(id: ID): Promise<void>;
};
