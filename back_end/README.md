# Fiction Platform Backend

TypeScript backend for Fiction Platform MVP using Express, Prisma, and PostgreSQL.

## Tech stack

- Node.js 20+
- Express (layered structure)
- Prisma ORM
- PostgreSQL 16 (Docker)
- JWT access + refresh auth
- RBAC (`user`, `creator`, `admin`, `finance`)
- Vitest + Supertest
- OpenAPI docs via Swagger UI

## Project structure

- `src/` app source code
- `prisma/` schema, migrations, seed
- `tests/` unit + integration tests
- `docker-compose.yml` local PostgreSQL (main + test)

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create `.env`

```bash
cp .env.example .env
```

3. Start PostgreSQL containers

```bash
docker compose up -d
```

4. Apply migrations

```bash
npm run prisma:migrate:deploy
```

5. Generate Prisma client

```bash
npm run prisma:generate
```

6. Seed demo data

```bash
npm run prisma:seed
```

7. Run API

```bash
npm run dev
```

## API docs

- Swagger UI: `http://localhost:3000/docs`
- Base API: `http://localhost:3000/api/v1`

## Demo accounts (from seed)

- `admin@example.com`
- `finance@example.com`
- `creator@example.com`
- `user@example.com`
- Password (all): `password123`

## Important commands

```bash
npm run build
npm run test
npm run test:unit
RUN_INTEGRATION_TESTS=1 npm run test:integration
```

## Notes

- Soft delete is enabled for `users`, `novels`, `chapters` (`deleted_at`).
- Partial unique indexes and `updated_at` triggers are in `prisma/migrations/0002_sql_addons/migration.sql`.
- Payment flow uses internal mock workflow endpoints (no real payment gateway yet).
