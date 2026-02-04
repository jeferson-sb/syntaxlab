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
const makeBoardRepository = ({ boardStore }): Repository<Board> => ({
  async getNextId() {
    return { value: crypto.randomUUID() };
  },
  async store(entity: Board) {
    boardStore.push(entity);
  },
});

type DepsBlock = { blockStore: Block[] };
const makeBlockRepository = ({ blockStore }): Repository<Block> => ({
  async getNextId() {
    return crypto.randomUUID();
  },
  async store(entity: Block) {
    blockStore.push(entity);
  },
});

const makeCreateProject = () => {
  // TBD
};
