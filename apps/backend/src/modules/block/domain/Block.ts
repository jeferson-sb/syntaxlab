import { Repository } from "@/shared/domain/Repository";

export type BlockRepository = Repository<Block>;

export type Block = {
  id: string;
  type: "code" | "note" | "bookmark" | "image";
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
