# Full-Stack TypeScript Project

This repository contains a full-stack TypeScript project with a Next.js frontend and a NestJS backend. The project is set up with modern development tools and practices, including Docker for database management, ESLint for linting, Prettier for code formatting, and pre-commit hooks with Husky and lint-staged.

## Project Structure

- `packages/frontend`: Next.js frontend application
- `packages/backend`: NestJS backend application
- `docker-compose.yml`: Docker configuration for PostgreSQL and Adminer
- `init.sql`: Initial SQL script for database setup

## Technologies Used

- **Frontend**: Next.js, TailwindCSS, shadcn/ui
- **Backend**: NestJS, PostgresJS
- **Database**: PostgreSQL (via Docker)
- **Tools**: ESLint, Prettier, Husky, lint-staged

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Yarn package manager
- Docker and Docker Compose

### Setup

1. Install dependencies:
   ```
   yarn install
   ```

2. Start the PostgreSQL database and Adminer:
   ```
   yarn docker:up
   ```

   This command will start a PostgreSQL instance and Adminer for database management. The database will be initialized with the script in `init.sql`.

### Running the Backend

To run the backend in development mode:

```
yarn dev:backend
```

Note: Ensure that Docker is running and the PostgreSQL container is up before starting the backend.

### Running the Frontend

To run the frontend in development mode:

```
yarn dev:frontend
```

### Additional Commands

- `yarn build:all`: Build both frontend and backend
- `yarn lint`: Run ESLint on all workspaces
- `yarn format`: Run Prettier on all workspaces

### Utility Commands

- `yarn nest <command>`: Run NestJS CLI commands (wrapper for the backend)
- `yarn cn <command>`: Run shadcn/ui commands (wrapper for the frontend)

## Development Workflow

1. Make your changes in the respective packages.
2. Run `yarn lint` and `yarn format` to ensure code quality.
3. Commit your changes. Husky will run pre-commit hooks to check linting and formatting.
4. Push your changes and create a pull request.

## Database Management

Adminer is available for database management at `http://localhost:8080` when the Docker containers are running.

## Additional Information

- The project uses a monorepo structure with Yarn workspaces.
- TailwindCSS is pre-configured for styling in the frontend.
- PostgresJS is used for database queries in the backend.
- ESLint and Prettier configurations are shared across workspaces.