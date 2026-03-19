# Elysia Controller Module Composition Pattern

## Status

Accepted

## Date

2026-02-19

## Context

In our Elysia backend, we use a modular architecture where each feature module has:

- A **container** (`container.ts`) that registers dependencies via `.decorate()` and `.resolve()`
- A **controller** (`projectController.ts`) that defines HTTP routes

Initially, we considered two approaches for composing these:

1. **Centralized composition**: Register the module in `makeServer()`, then add the controller separately
2. **Controller-owned composition**: Have each controller `.use()` its own module internally

The challenge was **TypeScript type inference**. When the module and controller are composed separately in `makeServer()`, TypeScript cannot infer the decorated context types (use cases, repositories) in the controller's route handlers.

## Decision

We decided to have **controllers own their module composition** by calling `.use(registerModuleContainer())` directly within the controller definition.

```typescript
// projectController.ts
export const makeProjectController = (projectRepository?: ProjectRepository) =>
  new Elysia({ prefix: "/projects" })
    .use(registerProjectContainer({ projectRepository }))
    .post("/", ({ body, createProjectUseCase }) => {
      // TypeScript knows about createProjectUseCase ✓
      createProjectUseCase(body);
    });
```

Then in `makeServer()`, we simply add the controller:

```typescript
const makeServer = () =>
  new Elysia({ prefix: "/api" }).use(projectController).use(boardController);
```

## Consequences

### Positive

- **Full type inference**: Route handlers have complete TypeScript support for all decorated/resolved dependencies
- **Self-contained modules**: Each controller is a complete, testable unit with its dependencies
- **Simpler testing**: Controllers can receive mock repositories directly via the factory function
- **Clearer dependency graph**: Looking at a controller shows exactly what it depends on

### Negative

- **Implicit module registration**: The module is registered as a side effect of using the controller
- **Potential duplicate registration**: If not careful, the same module could be registered multiple times (mitigated by Elysia's named plugin deduplication)

### Neutral

- **Different from typical DI patterns**: Developers familiar with other DI containers may expect centralized registration
