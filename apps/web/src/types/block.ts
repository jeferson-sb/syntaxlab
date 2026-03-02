export type Block = {
  id: string;
  type: "code" | "note" | "bookmark" | "image" | "sticky";
  x: number;
  y: number;
};

export type CodeBlock = Block & {
  props: {
    title?: string;
    inlineCode?: string;
    lang?: string;
  };
};
export type NoteBlock = Block & {
  props: {
    content?: string;
    aiPreview?: string;
    color?: string;
    textSize?: string;
  };
};

export type StickyBlock = Block & {
  props: {
    title?: string;
    content?: string;
    color?: string;
  };
};

export type BookmarkBlock = Block & {
  props: {
    title?: string;
    content?: string;
    href?: string;
    imageUrl?: string;
  };
};
export type ImageBlock = Block & {
  props: {
    title?: string;
    href?: string;
    width?: string;
    height?: string;
  };
};

export type BlockPropsByType = {
  code: CodeBlock["props"];
  note: NoteBlock["props"];
  bookmark: BookmarkBlock["props"];
  image: ImageBlock["props"];
  sticky: StickyBlock["props"];
};

type MergedBlockProps = Partial<
  CodeBlock["props"] &
    NoteBlock["props"] &
    BookmarkBlock["props"] &
    ImageBlock["props"] &
    StickyBlock["props"]
>;

export type AnyBlock = {
  id: string;
  type: keyof BlockPropsByType;
  x: number;
  y: number;
  props: MergedBlockProps;
};
