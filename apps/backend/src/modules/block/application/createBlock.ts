import type {
  BookmarkBlock,
  CodeBlock,
  ImageBlock,
  NoteBlock,
  BlockRepository,
} from "@/modules/block/domain/Block";
import {
  createBookmarkBlock,
  createCodeBlock,
  createImageBlock,
  createNoteBlock,
} from "@/modules/block/domain/Block";

export type BlockPropsByType = {
  code: CodeBlock["props"];
  note: NoteBlock["props"];
  bookmark: BookmarkBlock["props"];
  image: ImageBlock["props"];
};

type CreateBlockDTO<
  TType extends keyof BlockPropsByType = keyof BlockPropsByType
> = {
  type: TType;
  x: number;
  y: number;
  props: BlockPropsByType[TType];
};

export type AnyCreateBlockDTO = {
  [K in keyof BlockPropsByType]: CreateBlockDTO<K>;
}[keyof BlockPropsByType];

export const makeCreateBlock =
  ({ blockRepository }: { blockRepository: BlockRepository }) =>
  async (payload: AnyCreateBlockDTO) => {
    const id = await blockRepository.getNextId();
    let block;

    switch (payload.type) {
      case "code":
        block = createCodeBlock({ id, ...payload });
        break;

      case "bookmark":
        block = createBookmarkBlock({ id, ...payload });
        break;

      case "image":
        block = createImageBlock({ id, ...payload });
        break;

      default:
        block = createNoteBlock({ id, ...payload });
        break;
    }

    await blockRepository.store(block);

    return block.id;
  };
