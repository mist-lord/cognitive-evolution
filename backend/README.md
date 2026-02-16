# Growth Backend (MVP)

This folder provides a zero-dependency Node.js backend for invite attribution and growth analytics.

## Run

```bash
node backend/server.js
```

Default address: `http://127.0.0.1:8787`

## API

- `GET /api/health`
- `POST /api/invites/register`
  - Body: `{ "inviteCode": "AB12CD", "referredBy": "ZX89QP" }`
- `POST /api/events`
  - Body: `{ "inviteCode": "AB12CD", "eventType": "share_result" }`
  - Supported `eventType`:
    - `share_link`
    - `share_result`
    - `share_card`
    - `assessment_completed`
- `GET /api/growth/{inviteCode}`
- `GET /api/growth/leaderboard?limit=10`

## Storage

- Current MVP storage: `backend/data/growth-store.json` (auto-created at runtime)
- Future production storage: PostgreSQL schema in `backend/schema.sql`
