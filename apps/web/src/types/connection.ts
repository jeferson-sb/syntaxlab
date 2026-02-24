export type Connection = {
  id: string;
  fromBlockId: string;
  toBlockId: string;
  fromAnchorId?: string;
  toAnchorId?: string;
};
