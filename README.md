# Products Without a Second Chance

Products Without a Second Chance is a circular commerce platform designed to reduce returns, recover value from returned goods, and keep usable products out of landfills. The system combines AI product grading, digital product passports, hyperlocal peer-to-peer matching, recycling and donation routing, rewards, and dashboards for users, sellers, and admins.

## Problem

Traditional returns often create reverse logistics cost, waste, fraud risk, and poor resale transparency. Many returned or outgrown products still have value, but platforms need better ways to grade condition, route items locally, inform buyers, reward sustainable behavior, and help sellers reduce future returns.

## Solution

The platform creates a closed-loop workflow:

1. Buyers receive prevention tools before checkout, including TrustLens, size and fit guidance, visual fit preview, and return probability scoring.
2. Returned or listed products are graded using AI image analysis.
3. A product health card and digital passport are generated for transparency.
4. Good-condition products are matched with nearby buyers.
5. Worn products are routed to refurbishment.
6. Recyclable products are routed to recycle centers.
7. Beyond-repair products can be donated to NGO partners.
8. Rewards, green credits, coupons, and seller insights drive repeat participation.

## Tech Stack

### Frontend

- React with Vite for a fast web dashboard experience.
- TypeScript for strongly typed UI logic.
- React Router for user, seller, and admin flows.
- TanStack Query for API state management.
- Socket.io client for real-time match, pickup, reward, and notification updates.
- Map UI integration planned through Google Maps APIs.

### Backend

- Node.js with Express for REST APIs.
- TypeScript for shared contracts and safer service code.
- PostgreSQL as the primary relational database.
- PostGIS for location-aware matching and nearby demand queries.
- Redis for geo-indexing, caching, queues, and short-lived OTP/session data.
- Socket.io for real-time user notifications and live negotiation/match events.
- Prisma ORM for schema management and database access.

### AI and External Services

- AWS Rekognition for image-based condition analysis and photo fraud checks.
- Groq with LLaMA models for product condition summaries, health card text, seller insights, and recommendation explanations.
- Google Maps Distance Matrix API for routing, distance calculation, and handoff planning.
- Email/SMS provider for OTP verification and operational notifications.

### DevOps and Quality

- Monorepo layout with separate web, API, shared package, and docs areas.
- Environment-based configuration through `.env`.
- Unit and integration testing planned for services, routing logic, and API contracts.
- CI-ready scripts for linting, testing, building, and formatting.

## Core Features

### User Registration and Onboarding

- Sign up with name, email, password, and phone.
- Email OTP verification.
- Profile setup with photo, location, sizes, preferences, and sustainability interests.
- Guided onboarding for listing, returns, and rewards.

### Authentication and Roles

- JWT-based login.
- Role-based routing for users, sellers, and admins.
- Protected API routes and dashboard access.

### User Dashboard

- Active listings.
- Ongoing matches.
- Pending returns.
- Reward wallet with coupons and green credits.
- Nearby demand map.
- Proactive nudges for products that may be ready to pass on.

### Return Prevention

- TrustLens review and complaint aggregation.
- Size and fit advisor based on user profile and brand history.
- Visual fit preview.
- Return probability score before checkout.
- Seller feedback loop when preventable returns are detected.

### Return and AI Grading Flow

- Return initiation from order history.
- Photo upload requirement.
- AI grading into unused, like new, worn, damaged, recyclable, or beyond repair states.
- Confidence score and condition explanation.
- Fraud detection on submitted photos.
- Routing recommendation after grading.

### Product Health Card

- Product name and category.
- AI condition grade.
- Photo evidence.
- Defects and notes.
- Previous owner count.
- Fair price estimate.
- Verified-by-AI badge.
- Visibility to future buyers.

### Digital Product Passport

- Lifetime ownership history.
- Condition at every handoff.
- Repair and refurbishment log.
- Carbon footprint tracking.
- Transparency record for resale.

### Neighborhood Matching

- Geo-based buyer and seller matching.
- Demand prediction around the seller.
- Map view with nearby buyer pins.
- Match score per buyer.
- Real-time buyer notification.
- AI-suggested price negotiation.

### Routing and Handoff

- Distance calculation through Google Maps.
- Contactless self-handoff for nearby matches.
- Public meeting point suggestion.
- OTP-based handoff confirmation.
- Last-mile pickup for longer distances.
- Tracking for both parties.

### Refurbishment

- Route worn or minor-damage products to refurbishment centers.
- Schedule pickup.
- Update product condition after repair.
- Relist as refurbished with an updated health card.
- Recover value for the original seller.

### Recycling

- Recyclability score.
- Nearest recycle center locator.
- Home pickup or drop-off scheduling.
- QR code handoff.
- Material and weight logging.
- Carbon saved calculation.
- Green credit issuance.

### NGO Donation

- Partner NGO discovery.
- Donation pickup scheduling.
- Donation receipt generation.
- Green credits and sustainability badges.

### Rewards

- Coupons for successful second-hand sales.
- Cashback for peer-to-peer transactions.
- Green credits for recycling, donations, and prevented returns.
- Milestone badges.
- Loyalty tiers such as Silver, Gold, and Platinum.
- Referral rewards.

### Seller Dashboard

- Return volume, reasons, and trend analytics.
- Listing health score.
- AI insights for photos, size charts, descriptions, and expectation gaps.
- Revenue recovered from resale.
- Competitor return-rate comparison.
- Loyalty and reward tracking.

### Admin Panel

- User management.
- Listing moderation.
- Return management and AI override.
- Recycle center management.
- Reward rule management.
- NGO partner management.
- Analytics, reports, and CSV exports.
- Fraud monitoring.

## Implementation Overview

The project is organized as a monorepo:

```text
HackOn-6.0/
  apps/
    web/                  React/Vite frontend
    api/                  Express backend
  packages/
    shared/               Shared TypeScript types and constants
  prisma/                 Database schema and migrations
  docs/                   Architecture, API, and feature documentation
```

### Frontend Implementation

The web app is split by feature domain. Each feature owns its UI components, hooks, and route-level views. Shared UI primitives live under `apps/web/src/components`, while cross-feature API helpers live under `apps/web/src/lib`.

Planned frontend route groups:

- `/auth` for signup, OTP, login, and onboarding.
- `/dashboard` for user activity and rewards.
- `/products` for product discovery, prevention signals, and health cards.
- `/returns` for return initiation and AI grading review.
- `/matches` for peer-to-peer matching and handoff.
- `/seller` for seller analytics.
- `/admin` for platform operations.

### Backend Implementation

The API is organized into controllers, services, routes, jobs, and integrations:

- Controllers validate HTTP input and shape responses.
- Services contain business logic such as grading, matching, routing, rewards, and passport updates.
- Routes bind controllers to Express endpoints.
- Jobs handle daily proactive nudges and analytics refreshes.
- Integrations wrap third-party services like AWS Rekognition, Groq, Google Maps, email, and SMS.

### Data Model

The initial Prisma schema models:

- Users and role-based profiles.
- Products and listings.
- Orders and returns.
- Product health cards.
- Product passport events.
- Matches and handoffs.
- Rewards and green credits.
- Recycle centers and NGO partners.

### AI Flow

1. User uploads return or listing photos.
2. Backend stores image metadata and sends images to AWS Rekognition.
3. Grading service calculates condition, recyclability, confidence, and fraud signals.
4. LLM service generates a plain-language summary.
5. Health card service creates or updates the product health card.
6. Routing service decides whether to match, refurbish, recycle, donate, or relist.

### Matching Flow

1. Seller lists or returns a good-condition product.
2. Matching service checks nearby demand using geo-indexed buyer intent.
3. Candidate buyers are ranked by distance, demand strength, category match, and trust score.
4. Seller chooses a buyer.
5. Buyer receives a real-time notification.
6. Routing service calculates handoff method and cost.
7. OTP confirmation finalizes the transaction.

## Project Structure

```text
apps/
  web/
    src/
      app/
      components/
      features/
      lib/
      routes/
      styles/
  api/
    src/
      config/
      controllers/
      integrations/
      jobs/
      lib/
      middleware/
      routes/
      services/
packages/
  shared/
    src/
docs/
prisma/
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+
- Redis 7+

### Setup

```bash
npm install
cp .env.example .env
npm run dev
```

### Useful Scripts

```bash
npm run dev       # Start web and API in development mode
npm run build     # Build all workspaces
npm run lint      # Run lint checks
npm run test      # Run tests
npm run format    # Format the codebase
```

## Environment Variables

See `.env.example` for the full list. Main groups include:

- Database and Redis connection strings.
- JWT and OTP secrets.
- AWS Rekognition credentials.
- Groq API key.
- Google Maps API key.
- Email and SMS provider credentials.

## Current Status

This repository currently contains the initial project skeleton, documentation, environment template, shared types, Prisma schema draft, and placeholder app/API entry points. The next implementation step is to install dependencies and build the first vertical slice: authentication, user onboarding, product listing, image grading stub, health card generation, and dashboard display.

