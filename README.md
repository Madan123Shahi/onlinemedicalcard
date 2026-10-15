# OnlineMedicalCard

A demo MERN telehealth app: patients create an account, pick a service, book a video visit slot, and manage their visits. Admins confirm or complete appointments and read contact messages. No real medical cards are issued and no payments are taken.

## Stack

| Layer | Package | Version |
| --- | --- | --- |
| Runtime | Node.js | 24 LTS or 26 LTS (needs 22+) |
| Database | MongoDB | 8.0.x (or 8.3) |
| API | Express | 5.3.0 |
| ODM | Mongoose | 9.11.1 |
| UI | React | 19.3.0 |
| Routing | React Router | 7.18.4 |
| Build | Vite | 8.3.4 |
| Styling | Tailwind CSS | 4.3.3 |

See `VERSIONS.pdf` for the full list.

## Run it

You need Node.js and a running MongoDB (local, or a free Atlas cluster).

```bash
# 1. API
cd server
cp .env.example .env        # then edit JWT_SECRET and MONGODB_URI
npm install
npm run seed                # creates 3 services and the admin user from .env
npm run dev                 # http://localhost:5000

# 2. Website (second terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

Log in as the admin with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in `server/.env`, then open `/admin`.

## API

| Method | Path | Access |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | public |
| GET | `/api/auth/me` | logged in |
| GET | `/api/services`, `/api/services/:slug` | public |
| GET | `/api/appointments/availability?date=YYYY-MM-DD` | public |
| GET / POST | `/api/appointments/mine`, `/api/appointments` | logged in |
| PATCH | `/api/appointments/:id/cancel` | owner |
| POST | `/api/contact` | public |
| GET / PATCH / POST | `/api/admin/...` | admin only |

## Security notes

- Passwords are hashed with bcrypt; sessions use 7-day JWTs.
- Public signups are always created as `patient`; the admin role can only be set by the seed script.
- Double booking is blocked by a unique partial index in MongoDB, not just by a UI check.
- Inputs are validated with Zod, headers set by Helmet, and auth/contact routes are rate limited.
- The token is kept in `localStorage` for simplicity. For production, prefer an httpOnly cookie.

## Before going live

This is a starting point. A real telehealth service also needs payments, real video calls, email notifications, consent and privacy handling that meets local health-data law, and a legal review of what the "card" represents.
