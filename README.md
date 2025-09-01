# PokeAPI Backend

## Assignment

Create an Express-based Node.js API application (written in TypeScript) that fetches data from the public PokeAPI and extends it with additional logic, data aggregation, or derived features.

This is a backend-only challenge – no frontend is required.

### Requirements

Your API must:

1. Be built with Node.js, Express, and TypeScript.
2. Interact with the PokeAPI using axios or another HTTP client.
3. Interact with a local database (In memory or instance) which holds your custom models, which can be linked with PokeAPI data. Example:
   - Trainer/ NPC information
     - Manage a team of Pokémon
     - Assign Gym badges
   - Gym's. Which can contain NPC's with certain Pokémon.
4. The Trainer interactions should be done via Authenticated routes.
   - No need for anything complex but a simple Username, password authentication. Returning a token or JWT.
   - Some of the routes should be locked down correctly behind authentication checks, for example:
     - A trainer should be able to see their team information only.
5. Include input validation and error handling.
6. Be well-structured and easy to read and extend.
7. Include basic unit tests for key services or logic.
8. Include a README.md (this file) with instructions.

### Testing

You should include a few basic tests using any test framework (jest preferred).

### Tech Stack

- Node.js
- Express
- TypeScript
- MySQL (optional, can use an in memory cache or another DB Engine)
- Axios
- Jest (or another testing library)

Optional (for bonus points):

- Use a simple dependency injection pattern or structure.
- Use a caching mechanism like node-cache or redis.
- Add OpenAPI (Swagger) documentation.
- Password checks done with Bcrypt using Hashed values
- ESLint + Prettier
- Husky for pre-commit hooks
- GitHub actions for validating code when raising a pull request (ESLint + Prettier)

### Code Quality

We expect clean, modular code with proper use of TypeScript types and interfaces. Favor readability and maintainability over premature optimization. The data structure is completely up to you, they can be as basic as needed or include extra information if you'd like but there should be no pressure to build out too many data points.

### Submission

Please provide:

1. A link to your GitHub/GitLab repo (public or private with access granted).
2. Instructions on how to run and test the application (if not covered in this README).

## Environment Variables

A `.env.example` file is provided in the project root with all required variables.

Create your local `.env` by copying it and then editing values for your machine:

```bash
cp .env.example .env
```

| Variable                 | Description                                          | Example                                                        |
|--------------------------|------------------------------------------------------|----------------------------------------------------------------|
| `NODE_ENV`               | Node.js environment mode                             | `development`                                                  |
| `API_HOST`               | Host address the API binds to                        | `localhost`                                                    |
| `API_PORT`               | Port the API listens on                              | `3000`                                                         |
| `API_JWT_SECRET`         | Secret key for signing JWTs                          | `CHANGE_ME!`                                                   |
| `API_CACHE_TTL_SECONDS`  | Cache time-to-live in seconds                        | `600`                                                          |
| `DATABASE_DRIVER`        | Database driver                                      | `mysql`                                                        |
| `DATABASE_ROOT_USER`     | Root database username                               | `root`                                                         |
| `DATABASE_ROOT_PASSWORD` | Root database password                               | `root`                                                         |
| `DATABASE_USER`          | Application database user                            | `app_user`                                                     |
| `DATABASE_PASSWORD`      | Application database password                        | `app_password`                                                 |
| `DATABASE_HOST`          | Database host                                        | `localhost`                                                    |
| `DATABASE_PORT`          | Database port (via Docker)                           | `3306`                                                         |
| `DATABASE_NAME`          | Database name                                        | `pokeapi_db`                                                   |
| `DATABASE_URL`           | Connection string for the application database       | `mysql://app_user:app_password@localhost:3306/pokeapi_db`      |
| `DATABASE_SHADOW_URL`    | Connection string for the Prisma shadow database     | `mysql://root:root@localhost:3306/pokeapi_db_shadow`           |
| `ADMINER_PORT`           | Adminer UI Port (via Docker)                         | `8080`                                                         |

Notes:

- `DATABASE_URL` is used by the app and Prisma migrations.
- `DATABASE_SHADOW_URL` is used by Prisma to safely apply migrations (shadow DB must be reachable).
- `ADMINER_PORT` lets you customize which local port Adminer runs on (default `8080`). If 8080 is in use, set `ADMINER_PORT=9090` and access Adminer at `http://localhost:9090`.

## NPM Scripts

| Script                    | Description                                |
|---------------------------|--------------------------------------------|
| `npm run docker:up`       | Start MySQL and other services via Docker |
| `npm run prisma:migrate`  | Apply Prisma migrations                    |
| `npm run prisma:generate` | Generate Prisma client                     |
| `npm run dev`             | Start the dev server with hot reload       |
| `npm test`                | Run test suite with Jest                   |
| `npm run lint`            | Run ESLint                                 |
| `npm run format`          | Format code using Prettier                 |

## Setup and Run Backend Server

```bash
# SHUTDOWN DOCKER AND REMOVE VOLUME
npm run docker:reset

# SETUP FRESH DOCKER INSTANCE
npm run docker:up

# INSTALL PROJECT DEPENDENCIES
npm ci

# APPLY DATABASE SCHEMA AND SEED GYM DATA
npm run prisma:migrate

# GENERATE PRISMA CLIENT
npm run prisma:generate

# RUN DEVELOPMENT SERVER
npm run dev
```

To stop and reset containers and volumes (destroys data):

```bash
npm run docker:reset
```

## Swagger API Docs

Swagger documentation is served automatically when the app is running.

Default URL: `http://localhost:3000/docs`

## Docker Container Access

Adminer is setup with Docker and provides a web-based SQL client to inspect and manage your database.

- URL: `http://localhost:${ADMINER_PORT}` (default `http://localhost:8080`)
- System: `MySQL`
- Server: `mysql` (the service name from docker-compose)
- Username: use `DATABASE_ROOT_USER` or `DATABASE_USER` from `.env`
- Password: use matching `DATABASE_ROOT_PASSWORD` or `DATABASE_PASSWORD`
- Database: `pokeapi_db` (or value of `DATABASE_NAME`)
