import { Repository } from "@/shared/domain/Repository";
import type {
  UpsertResult,
  BatchUpsertInput,
} from "@/shared/domain/UpsertResult";

export type BlockUpsertInput = BatchUpsertInput<
  Omit<Block, "id"> & { boardId?: string; props: Record<string, unknown> }
>;

export type BlockRepository = Repository<Block> & {
  batchUpsert(entities: BlockUpsertInput[]): Promise<UpsertResult[]>;
};

export type Block = {
  id: string;
  type: "code" | "note" | "bookmark" | "image" | "sticky";
  x: number;
  y: number;
};

export type CodeBlock = Block & {
  props: {
    inlineCode: string;
  };
};
export type NoteBlock = Block & {
  props: {
    content: string;
    size: "small" | "medium" | "large";
  };
};
export type BookmarkBlock = Block & {
  props: {
    href: string;
  };
};
export type ImageBlock = Block & {
  props: {
    href: string;
    width: string;
    height: string;
  };
};

export const createCodeBlock = ({
  id,
  type,
  x,
  y,
  props,
}: CodeBlock): CodeBlock => ({
  id,
  type,
  x,
  y,
  props: {
    inlineCode: props.inlineCode,
  },
});

export const createNoteBlock = ({
  id,
  type,
  x,
  y,
  props,
}: NoteBlock): NoteBlock => ({
  id,
  type,
  x,
  y,
  props: {
    content: props.content,
    size: props.size,
  },
});

export const createBookmarkBlock = ({
  id,
  type,
  x,
  y,
  props,
}: BookmarkBlock): BookmarkBlock => ({
  id,
  type,
  x,
  y,
  props: {
    href: props.href,
  },
});

export const createImageBlock = ({
  id,
  type,
  x,
  y,
  props,
}: ImageBlock): ImageBlock => ({
  id,
  type,
  x,
  y,
  props: {
    href: props.href,
    width: props.width,
    height: props.height,
  },
});

export type StickyBlock = Block & {
  props: {
    title?: string;
    content?: string;
    color?: string;
  };
};

export const createStickyBlock = ({
  id,
  type,
  x,
  y,
  props,
}: StickyBlock): StickyBlock => ({
  id,
  type,
  x,
  y,
  props: {
    title: props.title,
    content: props.content,
    color: props.color,
  },
});
