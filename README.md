# Expense Sharing App

A small full-stack expense-sharing application inspired by Splitwise. Record who paid for whom, browse the expense
history, and see the **net balance** between every pair of users. The interface is in Persian (RTL).

- **Web app:** <!-- TODO: frontend URL -->
- **API:** <!-- TODO: backend URL -->/api
- **API docs (Swagger):** <!-- TODO: backend URL -->/docs

## Table of Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [How balances work](#how-balances-work)
- [Run locally](#run-locally)
- [Configuration](#configuration)
- [Seed data](#seed-data)
- [API reference](#api-reference)
- [Project structure](#project-structure)
- [Design decisions](#design-decisions)
- [Manual test scenario](#manual-test-scenario)
- [Scripts](#scripts)
- [Deployment](#deployment)

## Features

- One page with two views, **Expenses** and **Balances**, switched with accessible tabs.
- **Add Expense** modal with validation (paid by, expense for, amount, description).
- Expense history with who paid, who it was for, amount, description and date (Jalali calendar), newest first, with"load
  more" pagination.
- Net balances between users: transactions in both directions are netted, settled pairs disappear.
- Loading skeletons, error states with retry, and empty states everywhere.
- Persian UI with RTL layout, Persian digits, and Persian/Arabic digit input support in the amount field.
- Keyboard and screen-reader friendly (focus trap in the modal, ARIA tabs, `aria-invalid` on fields, reduced-motion
  support).
- REST API documented with Swagger, health check endpoint that also verifies the database connection.

## Tech stack

| Layer                         | Technology                                             |
|-------------------------------|--------------------------------------------------------|
| Backend                       | NestJS, TypeScript, TypeORM, PostgreSQL                |
| Backend config and validation | `@nestjs/config`, class-validator / class-transformer  |
| API docs                      | Swagger (`@nestjs/swagger`)                            |
| Frontend                      | React, Vite, TypeScript                                |
| Styling                       | Tailwind CSS, Vazirmatn font (self-hosted)             |
| Server state                  | TanStack React Query                                   |
| UI state                      | Zustand                                                |
| Forms                         | React Hook Form, Zod                                   |
| UI primitives                 | Radix UI (Dialog, Tabs), lucide-react, react-hot-toast |

## How balances work

An expense is a single **directional transaction**:

```
paidBy → paidFor → amount
Alice  → Bob     → $50     means: Bob owes Alice $50
```

Transactions between the same two users are **netted**, regardless of direction:

| Transaction       | Result                       |
|-------------------|------------------------------|
| Alice → Bob → $50 | Bob owes Alice $50           |
| Bob → Alice → $20 | Bob owes Alice $30           |
| Bob → Alice → $30 | Settled, the pair disappears |

## Run locally

### Prerequisites

- Node.js 20 or newer
- [pnpm](https://pnpm.io/)
- A running PostgreSQL instance

### 1. Create the database

```sql
CREATE
DATABASE expense_sharing;
```

### 2. Start the backend

```bash
cd back-end
pnpm install
cp .env.example .env     # then edit the DATABASE_* values
pnpm start:dev
```

In a second terminal, seed the database:

```bash
cd back-end
pnpm seed
```

The backend runs on `http://localhost:5000`:

| URL           | Description                                          |
|---------------|------------------------------------------------------|
| `/`           | Landing page                                         |
| `/docs`       | Swagger UI                                           |
| `/api/health` | Health check (also verifies the database connection) |

### 3. Start the frontend

```bash
cd front-end
pnpm install
cp .env.example .env     # VITE_API_URL points to the backend
pnpm dev
```

Open the URL printed by Vite (by default `http://localhost:5173`).

## Configuration

### Backend (`back-end/.env`)

| Variable            | Required | Default       | Description                           |
|---------------------|----------|---------------|---------------------------------------|
| `NODE_ENV`          | no       | `development` | `development`, `production` or `test` |
| `PORT`              | no       | `5000`        | HTTP port                             |
| `DATABASE_HOST`     | yes      |               | PostgreSQL host                       |
| `DATABASE_PORT`     | no       | `5432`        | PostgreSQL port                       |
| `DATABASE_NAME`     | yes      |               | Database name                         |
| `DATABASE_USERNAME` | yes      |               | Database user                         |
| `DATABASE_PASSWORD` | no       | empty         | Database password                     |

Environment variables are validated at startup, so a missing or invalid value fails immediately with a clear message.

In `development` the schema is created and synchronized from the entities and SQL is logged. In any other environment
auto-sync is disabled and migrations from `src/database/migrations` run on startup.

### Frontend (`front-end/.env`)

| Variable       | Required | Example                     | Description                 |
|----------------|----------|-----------------------------|-----------------------------|
| `VITE_API_URL` | yes      | `http://localhost:5000/api` | Base URL of the backend API |

Vite inlines this value at **build time**, so it must be set when running `pnpm build`, not only when serving the
result. It is validated on load.

## Seed data

`pnpm seed` (in `back-end`) inserts 8 users and 17 sample expenses. The data includes transactions in opposite
directions, a fully settled pair and decimal amounts, so every state of the UI can be seen right away.

- It is **idempotent**: running it again does not duplicate users, and expenses are only inserted when the table is
  empty.
- `pnpm seed:fresh` removes all expenses and seeds them again (blocked when `NODE_ENV=production`).
- Everything runs in a single transaction, so a failure never leaves partial data.
- The data lives in `back-end/src/database/data/seed.json` and can be edited without touching code.

## API reference

All endpoints are prefixed with `/api`. Interactive documentation is available at `/docs`.

| Method | Path                            | Description                                   |
|--------|---------------------------------|-----------------------------------------------|
| `GET`  | `/api/users`                    | List all users                                |
| `GET`  | `/api/users/:id`                | Get a single user                             |
| `GET`  | `/api/expenses?page=1&limit=20` | List expenses, newest first (`limit` max 100) |
| `POST` | `/api/expenses`                 | Record a new expense                          |
| `GET`  | `/api/balances`                 | Net balances between users                    |
| `GET`  | `/api/health`                   | API and database health                       |

### Create an expense

`POST /api/expenses`

```json
{
  "paidById": 1,
  "paidForId": 2,
  "amount": 50,
  "description": "Dinner"
}
```

| Field         | Rules                                                                      |
|---------------|----------------------------------------------------------------------------|
| `paidById`    | integer, an existing user (the person who paid)                            |
| `paidForId`   | integer, an existing user, different from `paidById` (the person who owes) |
| `amount`      | positive number in dollars, at most 2 decimal places, at most 1,000,000    |
| `description` | non-empty after trimming, at most 255 characters                           |

Unknown fields are rejected. Responses: `201` with the created expense (including `paidBy` and `paidFor`), `400` for
validation errors or identical users, `404` if a user does not exist.

### List expenses

```json
{
  "items": [
    {
      "id": 1,
      "amount": 50,
      "description": "Dinner",
      "createdAt": "2026-09-30T12:00:00.000Z",
      "paidById": 1,
      "paidForId": 2,
      "paidBy": {
        "id": 1,
        "name": "Alice",
        "createdAt": "..."
      },
      "paidFor": {
        "id": 2,
        "name": "Bob",
        "createdAt": "..."
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### Net balances

`GET /api/balances` returns one entry per user pair with a non-zero balance, largest first. Read it as: **`debtor` owes
`creditor` `amount`**.

```json
[
  {
    "debtor": {
      "id": 2,
      "name": "Bob"
    },
    "creditor": {
      "id": 1,
      "name": "Alice"
    },
    "amount": 30
  }
]
```

## Project structure

```
.
├── back-end/src/
│   ├── common/        Abstract entity, money transformer, shared DTOs
│   ├── config/        Typed configuration, env validation, Swagger setup
│   ├── database/      TypeORM config and module, seeder, seed data
│   ├── users/         List / get user
│   ├── expenses/      Create and list expenses
│   ├── balances/      Net balances between users
│   ├── app.controller.ts   Landing page and health check
│   └── main.ts
│
└── front-end/src/
    ├── app/           Providers and React Query client
    ├── config/        Validated environment variables
    ├── lib/           API client, number and date formatting
    ├── stores/        Zustand UI store (active tab, modal)
    ├── components/ui/ Generic UI (dialog, tabs, form field, skeleton, ...)
    ├── features/
    │   ├── users/     API, query keys, hooks
    │   ├── expenses/  API, hooks, Zod schema, list, modal and form
    │   └── balances/  API, hooks, list
    └── pages/         Home page
```

Both projects are organized by feature. Dependencies only point one way (`pages → features → components/ui → lib`), and
a feature is used through its `index.ts`, never through its internals.

## Design decisions

### Backend

**Balances are computed, not stored.** Expenses are the single source of truth. A stored balance would have to be
updated in the same transaction as every new expense, and any bug or partial failure would leave the two out of sync.
Aggregating on demand is fast at this scale and can never drift from the data.

**Netting happens in the database.** Each transaction is mapped to an ordered pair with `LEAST` / `GREATEST` on the user
IDs, so `Alice → Bob` and `Bob → Alice` land in the same `GROUP BY` bucket. A `CASE` expression signs each amount by
direction and the sum says who owes whom. Only the (small) number of user pairs reaches the application, which resolves
user names through `UsersService`.

**Money is stored as integer cents.** Floating point cannot represent values like `0.1 + 0.2` exactly. Amounts are
`integer` cents in the database, converted by a TypeORM `ValueTransformer`, so the API and the rest of the code use
plain dollars. Input is limited to 2 decimals and a maximum amount, so rounding never loses information.

**Business rules are enforced twice.** DTO validation gives clean `400` errors. Database constraints are the last line
of defence: `amount > 0`, `paidById <> paidForId`, foreign keys with `ON DELETE RESTRICT` (financial history cannot
disappear by deleting a user), and indexes on both foreign keys.

**Pairwise netting, not debt simplification.** Balances show the net amount between each pair, as specified. Global
simplification (turning `A→B→C` into `A→C`) is a different problem and was left out on purpose.

**No caching.** The balances query is a cheap aggregate on indexed columns. A cache would add invalidation logic,
coupling between modules and stale-data risk without a measurable gain.

**Seeding is a separate script**, not part of application startup. It boots the same Nest context (same config and DI)
without an HTTP server.

### Frontend

**Server state lives in React Query, UI state in Zustand.** Expenses, balances and users are cached and refetched by
React Query. Zustand only holds client state (active tab, modal open). After an expense is created, both the expenses
and balances queries are invalidated, so an inactive tab is never shown stale.

**Form values are strings; conversion happens once at the API boundary.** The Zod schema mirrors the backend rules
(positive amount, 2 decimals, maximum, different users) for instant Persian feedback, accepts Persian and Arabic digits,
and a single function converts the validated values into the API payload. The backend remains the authority.

**Resilient lists.** A failed background refetch never replaces already-loaded data with an error screen, and a failed
"load more" keeps the list and offers a retry. Duplicate rows caused by offset pagination are removed by ID.

**Lazy-loaded modal.** The dialog, form and React Hook Form are split into their own chunk and prefetched on hover or
focus of the "Add expense" button, keeping the initial bundle small without a visible delay.

**Self-hosted font and no external CDNs**, so the app works the same inside Iran. Animations are CSS-only and disabled
for users who prefer reduced motion.

**Logical CSS properties** (`start` / `end`) are used instead of `left` / `right`, so the layout follows the document
direction.

## Manual test scenario

After `pnpm seed:fresh`:

- `GET /api/balances` returns 12 entries. The pair Hadi / Nik-Aein is fully settled, so it is absent.
- Record an expense paid by **محسن** for **رضا** of `10`. The balance "محسن owes رضا" drops from 75 to 65, and the new
  expense appears first in the list.

From an empty database, this sequence shows the netting:

| Step | Expense                | Resulting balance       |
|------|------------------------|-------------------------|
| 1    | Alice → Bob → 50       | Bob owes Alice 50       |
| 2    | Bob → Alice → 20       | Bob owes Alice 30       |
| 3    | Bob → Alice → 30       | no entry (settled)      |
| 4    | Charlie → Alice → 12.5 | Alice owes Charlie 12.5 |

Error cases: the same user on both sides, an unknown user ID, amount `0`, negative or `10.999`, an extra field such as
`"id": 5`, and a whitespace-only description are all rejected by the API with `400` or `404`. The form catches most of
them before sending.

## Scripts

### Backend (`back-end`)

| Script            | Description                                              |
|-------------------|----------------------------------------------------------|
| `pnpm start:dev`  | Run in watch mode                                        |
| `pnpm build`      | Compile to `dist/`                                       |
| `pnpm start:prod` | Run the compiled app                                     |
| `pnpm seed`       | Seed users and sample expenses                           |
| `pnpm seed:fresh` | Remove expenses, then seed again (blocked in production) |
| `pnpm seed:prod`  | Run the compiled seeder                                  |

### Frontend (`front-end`)

| Script         | Description                         |
|----------------|-------------------------------------|
| `pnpm dev`     | Start the Vite dev server           |
| `pnpm build`   | Type-check and build for production |
| `pnpm preview` | Serve the production build locally  |

## Deployment

<!-- TODO: describe the deployment (platform, database, environment variables, migration and seed steps) once deployed -->