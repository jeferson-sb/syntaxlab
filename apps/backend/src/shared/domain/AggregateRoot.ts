export type AggregateId<T> = {
  value: T;
};

export type AggregateRoot<ID extends AggregateId<any>> = {
  readonly id: ID;
};
