# Notification Preferences Service

Backend service for deciding whether a notification can be sent to a user through a specific channel, region, and time.

The service stores:

- default notification preferences;
- user notification preferences;
- user quiet hours;
- global notification policies.

It does not send notifications. It only returns an `allow` or `deny` decision with a short reason.

## Stack

- TypeScript
- Node.js
- NestJS
- PostgreSQL
- Prisma
- Jest

## Setup

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/notification_preferences
```

Run PostgreSQL and create the database if it does not exist:

```sql
CREATE DATABASE notification_preferences;
```

Apply migrations:

```bash
npx prisma migrate dev
```

Seed default preferences:

```bash
npm run prisma:seed
```

Start the app:

```bash
npm run start:dev
```

## Tests

Run unit tests:

```bash
npm run test
```

Build check:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## API

Get user preferences:

```http
GET /users/:id/preferences
```

Update user preferences:

```http
POST /users/:id/preferences
```

Example body:

```json
{
  "preferences": [
    {
      "notificationType": "marketing",
      "channel": "email",
      "enabled": false
    }
  ],
  "optionalNotificationsEnabled": true,
  "quietHours": {
    "enabled": true,
    "startTime": "22:00",
    "endTime": "08:00",
    "timezone": "Europe/Istanbul"
  }
}
```

Create or update global policy:

```http
POST /global-policies
```

Example body:

```json
{
  "notificationType": "marketing",
  "channel": "sms",
  "region": "EU",
  "action": "deny",
  "reason": "marketing_sms_blocked_in_eu",
  "enabled": true
}
```

Evaluate notification:

```http
POST /evaluate
```

Example body:

```json
{
  "userId": "user-1",
  "notificationType": "marketing",
  "channel": "sms",
  "region": "EU",
  "datetime": "2026-05-21T21:30:00Z"
}
```

Example response:

```json
{
  "decision": "deny",
  "reason": "blocked_by_global_policy"
}
```

## Architecture

The project uses a layered NestJS structure:

```text
Controller -> Service -> Repository -> Prisma/PostgreSQL
```

Rules:

- controllers handle HTTP and return RTOs;
- services contain business logic and return domain entities;
- repositories talk to Prisma and return domain entities;
- Prisma models are not returned directly from controllers;
- mappers convert Prisma objects to entities and entities to RTOs.

Main modules:

- `PreferencesModule` handles user preferences, settings, quiet hours, and default preferences.
- `PoliciesModule` handles global notification policies.
- `EvaluationModule` contains the final decision logic and uses `PreferencesService` and `PoliciesService`.

Evaluation order:

1. Global deny policy
2. User preference
3. Default preference
4. User optional notifications disabled
5. Quiet hours
6. Allow

Quiet hours are evaluated with timezone support using Luxon.

## Production Improvements

If this service were prepared for production, the next steps would be:

- authentication and authorization for API access;
- admin protection for global policy endpoints;
- Docker Compose for PostgreSQL and app startup;
- OpenAPI/Swagger documentation;
- structured JSON logging;
- metrics for evaluation allow/deny counts and latency;
- CI pipeline for lint, build, tests, and migrations;
- integration tests against a real PostgreSQL test database;
- audit logs for preference and policy changes.
