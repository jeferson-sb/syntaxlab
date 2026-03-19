## Naming Conventions

- Vue Components should always be in PascalCase (`BlockEditor.vue`) and always multi-word.
- TypeScript files should always be in camelCase (`blockStore.ts`).
- API routes should be in kebab-case (`/api/blocks`).
- Tests should either end with `.test.ts` or `.spec.ts`
- Variables must be in camelCase (`blockData`), constants in UPPER_SNAKE_CASE (`MAX_BLOCKS`).

## TypeScript/JavaScript

- Prefer Type over Interface for defining types, unless you need declaration merging or to describe an object with callable properties.
- Prefer arrow functions for all function definitions, except when defining methods on classes or objects.
- Avoid using `any` type; use `unknown` if you need to represent an unknown type and want to enforce type checking when using it.
- Avoid generic types or types that are too broad (e.g. `Record<string, string>`)
- Break down long types with smaller ones, like splitting profile props from user to have `User` and `UserProfile`.
- Avoid multiple if clauses and nested ternaries; prefer early returns and guard clauses for better readability.
- Function parameters cannot be more than 3, and if they are, consider refactoring to use an options object or breaking the function into smaller ones.

## DDD and Architecture

- Respect the boundaries of each layer (presentation, application, domain, infrastructure) and avoid leaking concerns across them.
- Do not import modules in the wrong layer (e.g. domain should not import application or infrastructure).
- Use dependency injection to manage dependencies between layers and modules, and avoid tight coupling.
