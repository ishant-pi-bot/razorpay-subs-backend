# Razorpay Subscriptions Backend for Electron App

Production-ready backend for Electron desktop app subscription management.

## Setup

1. Copy `.env.example` to `.env` and fill values
2. Run `npm install`
3. Run `npx prisma db push`
4. Run `npx prisma db seed`
5. Run `npm run dev`

## Endpoints

- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `GET /plans` - Active plans
- `GET /users/me` - User profile
- `GET /entitlements/me` - Current entitlement
- `POST /billing/subscribe` - Subscribe
- `GET /billing/subscription` - Subscription status
- `POST /billing/cancel` - Cancel subscription
- `POST /webhooks/razorpay` - Razorpay webhook

## Example curl

```bash
# Register
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'

# Get entitlement (use access token)
curl -H "Authorization: Bearer ACCESS_TOKEN" http://localhost:3000/entitlements/me
```

## DB Seed

Run `npx tsx prisma/seed.ts` to seed plans.
