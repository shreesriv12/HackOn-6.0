# Architecture

The platform uses a TypeScript monorepo with a React frontend, Express API, shared type package, PostgreSQL database, Redis geo/cache layer, and third-party integrations for AI and routing.

## Main Modules

- Auth: signup, login, OTP verification, JWT issuance, and role-based access.
- Product: product catalog, listings, health cards, and digital passport events.
- Return: return initiation, photo upload, AI condition grading, and routing decisions.
- Matching: nearby demand lookup, buyer ranking, negotiation, and handoff confirmation.
- Routing: distance calculation, pickup scheduling, self-handoff, and QR/OTP verification.
- Rewards: coupons, cashback, green credits, badges, and loyalty tiers.
- Seller: return analytics, listing health, and AI-generated improvement suggestions.
- Admin: moderation, partner management, reward rules, reports, and platform metrics.

## Request Flow

1. Frontend calls REST APIs with a JWT.
2. Express middleware authenticates and authorizes the request.
3. Controller validates input and forwards to the service layer.
4. Service layer reads/writes through Prisma and Redis.
5. Integrations are called through wrapper clients.
6. Events are emitted over Socket.io for live updates.

## Background Jobs

- Daily proactive nudge generation.
- Seller analytics refresh.
- Reward milestone checks.
- Recycle center capacity sync.
- Stale match expiry.

