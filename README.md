# SyntaxLab

A visual canvas workspace for developers and product engineers to plan features, organize ideas, and document code. Think of it as a developer's notebook that acts like a powerful visual architect.

## Features

- **Code snippets** — Save and organize code blocks with syntax highlighting
- **Sticky notes** — Quick notes for ideas, reminders, and TODOs
- **Bookmarks** — Link to documentation and resources with previews
- **Images** — Add diagrams, screenshots, and visual references
- **Canvas (boards)** — Organize content into separate workspaces

## Prerequisites

- [Bun](https://bun.sh) >= 1.3.5
- [Docker](https://docker.com) (for MongoDB and other services)

## Getting Started

```bash
# Install dependencies
bun install

# Start MongoDB
docker compose up -d

# Run development servers (web + backend)
bun dev
```

The web app runs at `http://localhost:5173` and the API at `http://localhost:3000`.

## Commands

| Command                        | Description                        |
| ------------------------------ | ---------------------------------- |
| `bun dev`                      | Start all apps in development mode |
| `bun test`                     | Run tests across all packages      |
| `bun build`                    | Build all packages                 |
| `bun run --filter web dev`     | Run only the web app               |
| `bun run --filter backend dev` | Run only the backend               |

## Project Structure

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

## Tech Stack

- **Frontend**: Vue 3, Pinia, VueUse, Reka UI
- **Backend**: Elysia, Mongoose, Google GenAI
- **Build**: Turborepo, Vite (Rolldown), TypeScript
- **Database**: MongoDB

## License

MIT
