## What

A visual canvas workspace for developers and product engineers to plan features, organize ideas, and document code. Think of it as a developer's notebook that acts like a powerful visual architect.

### Tech Stack

- **Frontend**: Vue 3, Pinia, VueUse, Reka UI
- **Backend**: Elysia, Mongoose, Google GenAI
- **Build**: Turborepo, Vite (Rolldown), TypeScript
- **Database**: MongoDB

### Project Structure

```
apps/
├── web/                      # Vue 3 frontend
│   └── src/
│       ├── components/       # Vue components (blocks/, toolbar/)
│       ├── store/            # Pinia stores (block, board, canvas, project)
│       ├── types/            # TypeScript type definitions
│       ├── services/         # API clients and external services
│       └── lib/              # Utility functions and helpers
│
└── backend/                  # Elysia API server (Clean Architecture)
    └── src/
        ├── bootstrap/        # App initialization
        ├── modules/          # Feature modules (block, board, project, ai)
        │   └── <module>/
        │       ├── application/   # Use cases
        │       ├── domain/        # Entities and business rules
        │       ├── infra/         # Repositories and adapters
        │       ├── presentation/  # HTTP controllers
        │       └── container.ts   # Dependency injection
        └── shared/
            ├── domain/       # Base classes (AggregateRoot, Repository)
            └── infra/        # Shared infrastructure (config)
```

### Styling

- **CSS Framework/Lib**: Open-props for design tokens and utility classes, Reka UI for pre-built components
- **Custom Styles**: Scoped CSS modules for component-specific styles, global styles for base theming and resets

## Why

- [Code Conventions](./docs/code_conventions.md)
- [ADRs](./docs/adrs/)

## How

Package Manager: Bun
JavaScript Runtime: Bun
Monorepo Build System: Turborepo

### Environment Variables

Copy the contents of each `.env.example` file to a new `.env` file in the same directory and fill in the required values.

### Installing

```bash
# Install dependencies
bun install

# Start MongoDB
docker compose up -d

# Run development servers (web + backend)
bun dev
```

### Building

```bash
bun run build
```

### Testing

```bash
bun run test
```

### Linting

```bash
bun run lint
bun run typecheck
```
