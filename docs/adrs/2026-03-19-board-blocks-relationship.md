# ADR: Board-Blocks Relationship and Population Strategy

## Status

Accepted

## Context

In our clean architecture implementation, we have a `Board` aggregate that contains `Block` entities. The domain model represents this relationship as:

```typescript
type Board = {
  id: BoardId;
  name: string;
  blocks: Block[];
  visibility: "private" | "public";
};
```

However, at the persistence layer (MongoDB), we store blocks as an array of ObjectId references:

```typescript
blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Block" }];
```

This creates a tension between:

1. **Application layer DTOs** - which accept `Block["id"][]` (array of IDs) for updates
2. **Domain entities** - which represent `blocks` as full `Block[]` entities
3. **Persistence layer** - which stores ObjectId references and uses Mongoose populate

We needed to decide where the mapping responsibility belongs and how to handle the impedance mismatch.

## Decision

We decided to:

1. **Keep the domain model pure** - `Board.blocks` remains `Block[]` representing the true aggregate relationship
2. **Use separate types for repository operations** - `UpdateBoardData` accepts `blockIds?: Block["id"][]` for mutations
3. **Populate at read time** - The repository's `get()` method uses Mongoose populate to hydrate the full `Block` entities
4. **Map at the infrastructure boundary** - The `BoardMapper` handles translation between persistence and domain representations

```typescript
// Domain - represents true relationship
type Board = {
  blocks: Block[];
};

// Repository input - accepts IDs for mutations
type UpdateBoardData = Partial<Omit<Board, "blocks">> & {
  blockIds?: Block["id"][];
};

// Repository implementation - populates on read
async get(id: BoardId) {
  const board = await boardModel
    .findOne({ _id: id.value })
    .populate("blocks");
  return BoardMapper.toEntity(board);
}
```

## Consequences

### Positive

- **Domain stays clean** - No persistence concerns leak into the domain model
- **Clear separation** - Application layer works with IDs, domain works with entities
- **Flexible querying** - Can choose to populate or not based on use case
- **DDD alignment** - Aggregates contain their full entity graphs when retrieved

### Negative

- **Additional complexity** - Multiple types for the same concept (`blocks` vs `blockIds`)
- **Populate dependency** - Mongoose models must be registered before populate runs
- **Performance consideration** - Full population on every read (can optimize with projections if needed)

### Risks

- Mongoose populate requires the referenced model to be registered; import order matters
- If blocks collection grows large, we may need pagination within the aggregate

## References

- [DDD Aggregates](https://martinfowler.com/bliki/DDD_Aggregate.html)
- [Mongoose Population](https://mongoosejs.com/docs/populate.html)
