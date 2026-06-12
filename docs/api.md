# API Draft

This document outlines the first API surface for the MVP.

## Auth

- `POST /api/auth/signup`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Products and Listings

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `POST /api/products/:id/listings`
- `GET /api/products/:id/passport`
- `GET /api/products/:id/health-card`

## Returns and Grading

- `POST /api/returns`
- `POST /api/returns/:id/photos`
- `POST /api/returns/:id/grade`
- `GET /api/returns/:id`
- `POST /api/returns/:id/route`

## Matching and Handoff

- `GET /api/matches`
- `POST /api/matches`
- `POST /api/matches/:id/accept`
- `POST /api/matches/:id/decline`
- `POST /api/handoffs/:id/confirm`

## Rewards

- `GET /api/rewards/wallet`
- `POST /api/rewards/redeem`

## Seller

- `GET /api/seller/analytics`
- `GET /api/seller/insights`
- `GET /api/seller/listings`

## Admin

- `GET /api/admin/metrics`
- `GET /api/admin/users`
- `GET /api/admin/listings`
- `GET /api/admin/returns`
- `POST /api/admin/reward-rules`

