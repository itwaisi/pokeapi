# Changelog

## v0.0.3

### 2025-09-01

- update setup and install instructions, `README.md`
- update environment variables, `.env.example`
  - add docker/mysql specific variables
  - add docker/adminer specific variables
  - remove shadow db url
- remove docker init script
  - remove `docker/mysql/init/01-init.sql`
  - remove command from docker-compose
- move mysql relation migration into schema
  - remove `prisma/migrations/20250828193128_badge/migration.sql`
  - update `prisma/schema.prisma`
  - update init migration, `prisma/migrations/202508280001_init_schema/migration.sql`
- update changelog files/sections
  - update `CHANGELOG.md`

### 2025-08-31

- update setup and install instructions, `README.md`
- update changelog files/sections
  - update `CHANGELOG.md`
- update plugin version numbers
  - update `package.json`
  - update `package-lock.json`
  - update `src/docs/swagger.ts`

## v0.0.2

### 2025-08-30

- create an example env file, `.env.example`
- create tsconfig file for tests
  - update `tsconfig.json`
  - update `tsconfig.test.json`
- update error logging, `src/middleware/error.ts`
- remove console logs, `src/services/createPokeApiService.ts`
- fix build issues
  - fix 'zodobject', `src/middleware/validate.ts`
  - fix 'any' type, `src/services/createTrainerService.ts`
  - add interface, `src/types/index.ts`
- update changelog files/sections
  - update `CHANGELOG.md`
- update plugin version numbers
  - update `package.json`
  - update `package-lock.json`
  - update `README.md`
  - update `src/docs/swagger.ts`

## v0.0.1

### 2025-08-29

- move project to github
