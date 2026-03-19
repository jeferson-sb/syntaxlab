# Batch Upsert Remote Sync Strategy

## Status

Accepted

## Date

2026-03-09

## Context

SyntaxLab is a visual canvas workspace that stores projects, boards, and blocks locally on the client. Users expect their work to persist across sessions and potentially sync across devices. We needed a strategy to synchronize local state with a backend MongoDB database.

Key requirements:

- **Offline-first**: The application should work without network connectivity
- **Conflict resolution**: Handle concurrent edits gracefully
- **Performance**: Minimize network requests and database operations
- **Simplicity**: Avoid complex real-time sync protocols (CRDTs, OT)

### Considered Alternatives

1. **Real-time sync (WebSocket-based)**
   - Pros: Immediate synchronization, collaborative editing
   - Cons: High complexity, requires persistent connections, overkill for single-user workflow

2. **Per-entity REST endpoints**
   - Pros: Simple API design, familiar patterns
   - Cons: N+1 request problem when syncing many entities, poor UX during bulk operations

3. **Batch upsert with timestamp-based conflict resolution**
   - Pros: Single request per entity type, simple conflict model, efficient bulk operations
   - Cons: Last-write-wins may lose concurrent edits (acceptable for single-user)

## Decision

We implemented a **batch upsert sync strategy** with the following characteristics:

### 1. Server-Generated IDs with Client References

The server generates MongoDB ObjectIds for persistence, while clients use a `clientRef` field to track their local IDs. This allows:

- Clients to work offline with local IDs
- Server to maintain referential integrity
- Mapping between local and server IDs after sync

```typescript
type UpsertResult = {
  clientRef: string; // Client's local ID
  serverId: string; // Server-generated MongoDB ObjectId
  action: "created" | "updated" | "skipped";
};
```

### 2. Timestamp-Based Conflict Resolution

Each entity has an `updatedAt` timestamp. During batch upsert:

- If `clientRef` doesn't exist → **create** new document
- If `clientRef` exists and client `updatedAt` > server `updatedAt` → **update**
- If `clientRef` exists and client `updatedAt` ≤ server `updatedAt` → **skip**

### 3. Separate Batch Endpoints Per Entity

```
POST /api/projects/batch
POST /api/boards/batch
POST /api/blocks/batch
```

Each endpoint accepts an array of entities and returns an array of results.

### 4. Automatic Relationship Linking

When syncing boards/blocks, the server resolves `projectId`/`boardId` from `clientRef` to actual ObjectIds and auto-links the relationships.

### 5. Incremental Block Sync

Only blocks modified since the last successful sync are sent, reducing payload size:

```typescript
const changedBlocks = lastSyncTime
  ? blocks.filter((b) => b.updatedAt > lastSyncTime)
  : blocks;
```

### 6. Bulk MongoDB Operations

The repository uses `insertMany` and `bulkWrite` for efficient database operations:

```typescript
const [createdDocs] = await Promise.all([
  toCreate.length > 0 ? model.insertMany(toCreate) : [],
  toUpdate.length > 0 ? model.bulkWrite(updateOps) : null,
]);
```

## Consequences

### Positive

- **Simple mental model**: Last-write-wins is predictable and easy to debug
- **Efficient network usage**: One request per entity type instead of per entity
- **Efficient database operations**: Bulk inserts/updates minimize round trips
- **Offline support**: Clients can queue changes and sync when online
- **Incremental sync**: Only changed blocks are transmitted, reducing bandwidth

### Negative

- **Eventual consistency**: Changes aren't immediately visible across sessions
- **Potential data loss**: Concurrent edits from multiple clients may overwrite each other
- **Ordered sync required**: Projects → Boards → Blocks must sync sequentially to resolve relationships

### Mitigations

- **Sync interval**: 2-minute polling provides reasonable freshness
- **Single-user focus**: Current use case doesn't require real-time collaboration
- **Future extensibility**: Can layer real-time updates via WebSocket on top of batch sync if needed

## Related ADRs

- [Elysia Controller Module Composition](./2026-02-19-elysia-controller-module-composition.md)
- [Board Blocks Relationship](./2026-03-19-board-blocks-relationship.md)
