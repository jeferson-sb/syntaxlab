import { Elysia, t } from "elysia";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";

type AggregateId<T> = {
  value: T;
};

type AggregateRoot<ID extends AggregateId<any>> = {
  readonly id: ID;
};

type DataMapper<AR extends AggregateRoot<any>, DATA> = {
  toEntity(data: DATA): AR;
  toData(entity: AR): DATA;
};

type Repository<
  T extends AggregateRoot<any>,
  ID extends AggregateId<any> = T["id"]
> = {
  getNextId(): Promise<ID>;
  store(entity: T): Promise<void>;
};

type ProjectId = AggregateId<string>;
type UserId = AggregateId<string>;
type BoardId = AggregateId<string>;

type Project = AggregateRoot<ProjectId> & {
  name: string;
  userId: UserId;
  boards: Board[] | null;
  createdAt: Date;
  updatedAt: Date;
};

type Board = AggregateRoot<BoardId> & {
  name: string;
  blocks: Block[];
  visibility: "private" | "public";
};

type Block = {
  id: string;
  type: "code" | "note" | "bookmark" | "image";
  x: number;
  y: number;
};

type CodeBlock = Block & {
  props: {
    inlineCode: string;
  };
};
type NoteBlock = Block & {
  props: {
    content: string;
    size: "small" | "medium" | "large";
  };
};
type BookmarkBlock = Block & {
  props: {
    href: string;
  };
};
type ImageBlock = Block & {
  props: {
    href: string;
    width: string;
    height: string;
  };
};

const createProject = (
  props: Omit<Project, "createdAt" | "updatedAt">
): Project => ({
  id: props.id,
  name: props.name,
  userId: props.userId,
  boards: props.boards,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createBoard = (props: Board): Board => ({
  id: props.id,
  name: props.name,
  visibility: props.visibility,
  blocks: props.blocks,
});

const createCodeBlock = ({ id, type, x, y, props }: CodeBlock): CodeBlock => ({
  id,
  type,
  x,
  y,
  props: {
    inlineCode: props.inlineCode,
  },
});

type DepsProject = { projectsStore: Project[] };
type ProjectRepository = Repository<Project>;
const makeProjectRepository = ({
  projectsStore,
}: DepsProject): Repository<Project> => ({
  async getNextId() {
    return { value: crypto.randomUUID() };
  },
  async store(entity: Project) {
    projectsStore.push(entity);
  },
});

type DepsBoard = { boardStore: Board[] };
type BoardRepository = Repository<Board>;
const makeBoardRepository = ({ boardStore }): Repository<Board> => ({
  async getNextId() {
    return { value: crypto.randomUUID() };
  },
  async store(entity: Board) {
    boardStore.push(entity);
  },
});

type DepsBlock = { blockStore: Block[] };
type BlockRepository = Repository<Block>;
const makeBlockRepository = ({ blockStore }): Repository<Block> => ({
  async getNextId() {
    return crypto.randomUUID();
  },
  async store(entity: Block) {
    blockStore.push(entity);
  },
});

// TODO: create DTOs
const makeCreateProject =
  ({ projectRepository }: { projectRepository: ProjectRepository }) =>
  async (payload) => {
    const id = await projectRepository.getNextId();

    const project = createProject({
      id,
      name: payload.name,
      userId: { value: payload.userId },
      boards: [],
    });

    await projectRepository.store(project);

    return project.id;
  };

const makeCreateBoard =
  ({ boardRepository }: { boardRepository: BoardRepository }) =>
  async (payload) => {
    const id = await boardRepository.getNextId();

    const board = createBoard({
      id,
      name: payload.name,
      visibility: payload.visibility,
      blocks: [],
    });

    await boardRepository.store(board);

    return board.id;
  };

const makeCreateBlock =
  ({ blockRepository }: { blockRepository: BlockRepository }) =>
  async (payload) => {
    const id = await blockRepository.getNextId();
    let block;

    switch (payload.type) {
      case "code":
        block = createCodeBlock({ id, ...payload });
        break;

      case "bookmark":
        break;

      case "image":
        break;

      default:
        // note
        break;
    }

    await blockRepository.store(block);

    return block.id;
  };

const container = {
  createProjectUseCase: makeCreateProject({
    projectRepository: makeProjectRepository({ projectsStore: [] }),
  }),
  createBoardUseCase: makeCreateBoard({
    boardRepository: makeBoardRepository({ boardStore: [] }),
  }),
  createBlockUseCase: makeCreateBlock({
    blockRepository: makeBlockRepository({ blockStore: [] }),
  }),
};

type Container = typeof container;

const { createProjectUseCase, createBoardUseCase, createBlockUseCase } =
  container;

const projectRouter = new Elysia({ prefix: "/projects" }).post(
  "/",
  ({ body }) => createProjectUseCase(body),
  {
    body: t.Object({
      name: t.String(),
      userId: t.String(),
      boards: t.Array(t.Any()),
    }),
  }
);

const boardRouter = new Elysia({ prefix: "/boards" }).post(
  "/",
  ({ body }) => createBoardUseCase(body),
  {
    body: t.Object({
      name: t.String(),
      visibility: t.Union([t.Literal("private"), t.Literal("public")]),
      blocks: t.Array(t.Any()),
    }),
  }
);

const blockRouter = new Elysia({ prefix: "/blocks" }).post(
  "/",
  ({ body }) => createBlockUseCase(body),
  {
    body: t.Object({
      type: t.Union([
        t.Literal("code"),
        t.Literal("note"),
        t.Literal("bookmark"),
        t.Literal("image"),
      ]),
      x: t.Number(),
      y: t.Number(),
      props: t.Record(t.String(), t.Any()),
    }),
  }
);

const app = new Elysia({ prefix: "/api" })
  .use(openapi({ references: fromTypes() }))
  .use(cors())
  .use(projectRouter)
  .use(boardRouter)
  .use(blockRouter);

app.listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
