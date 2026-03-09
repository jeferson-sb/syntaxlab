export type Board = {
  name: string;
  visibility: "private" | "public";
  projectId: string;
  _syncId?: string;
  updatedAt?: Date;
};
