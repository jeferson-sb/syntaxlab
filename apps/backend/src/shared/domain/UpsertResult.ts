export type UpsertResult = {
  clientRef: string;
  serverId: string;
  action: "created" | "updated" | "skipped";
};

export type BatchUpsertInput<T> = T & {
  clientRef: string;
  updatedAt: Date;
};
