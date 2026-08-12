# Lumina Skincare — Full-Stack E-Commerce Platform

A full-stack e-commerce web app for a skincare brand, built from scratch with a React/Vite frontend and a Node.js/Express/MongoDB backend. Features real JWT authentication, Redis-backed caching and refresh tokens, Cloudinary image uploads, and Cambodia-native QR payments via Bakong KHQR.

<!-- Add a screenshot or GIF of the homepage here once you have one, e.g.: -->
<!-- ![Homepage screenshot](./screenshots/home.png) -->

## Live Demo

**Live Site**: https://e-commerce-project-979i.onrender.com/

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Known Limitations / Roadmap](#known-limitations--roadmap)

## Features

**Storefront**
- Product catalog with pagination, category filtering, search, and sorting (newest, oldest, price)
- Product detail pages with recommended products
- Debounced search overlay
- Responsive nav, mobile nav, and cart sidebar

**Auth**
- Email/password signup and signin with hashed passwords (bcryptjs)
- Access + refresh token flow, refresh tokens stored in Redis (Upstash)
- HttpOnly cookie-based auth (not exposed to client JS)
- Silent token refresh on the frontend, with a custom `auth:expired` event to log the user out cleanly across the app without circular store dependencies
- Role-based route protection (`adminOnly` middleware) for product management

**Cart & Checkout**
- Server-side cart stored on the user document (add, update quantity, remove, clear)
- Zustand + Immer for frontend cart state, persisted across sessions
- Checkout flow generates a Bakong KHQR QR code for payment
- Backend polls Bakong's transaction-check endpoint and updates order status once payment is confirmed, then clears the user's cart

**Admin**
- Create, update, and delete products (admin-only)
- Product images uploaded to Cloudinary; old images cleaned up on update/delete
- Redis cache invalidation on any product write, so listings stay fresh

**Performance**
- Redis caching on product list and product detail endpoints
- Rate limiting on general API traffic, auth endpoints, and payment endpoints

## Tech Stack

**Frontend**
- React 19 + Vite
- Zustand (with Immer + persist middleware) for state management
- React Router v7
- react-hot-toast, react-loading-skeleton, lucide-react

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Redis (Upstash / ioredis) — caching + refresh token storage
- JWT (jsonwebtoken) for access/refresh tokens
- bcryptjs for password hashing
- Cloudinary for image storage
- bakong-khqr for KHQR payment generation
- express-rate-limit + rate-limit-redis for rate limiting

## Project Structure

```
e-commerce-project/
├── backend/
│   ├── config/         # DB, Cloudinary, Redis connections
│   ├── controller/     # Route handlers (auth, cart, product, payment)
│   ├── middleware/     # Auth protection, rate limiting
│   ├── models/         # Mongoose schemas (User, Product, Order)
│   ├── routes/         # Express route definitions
│   ├── services/       # Auth service logic
│   ├── utils/
│   └── server.js       # App entry point
└── frontend/
    ├── src/
    │   ├── components/ # Feature-based: auth, cart, checkout, home, product, shop
    │   ├── layout/      # Header, Footer, NavBar, Main
    │   ├── pages/       # Home, Shop, ProductDetail, Cart, Checkout, Auth
    │   ├── store/       # Zustand stores (auth, cart, product, modal)
    │   ├── styles/      # Base / layout / components / pages CSS architecture
    │   └── utils/       # fetchWithAuth, debounce hook, recommendations hook
    └── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)
- A Redis instance (e.g. free Upstash database)
- A Cloudinary account (for product images)
- A Bakong KHQR merchant account (for payment testing)

### Installation

```bash
# Clone the repo
git clone https://github.com/EklimSek/e-commerce-project.git
cd e-commerce-project

# Install backend dependencies (root package.json)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Running locally

You'll need two terminals — one for the backend, one for the frontend.

```bash
# Terminal 1 — backend (from project root)
npm run dev
# runs on http://localhost:5000

# Terminal 2 — frontend
cd frontend
npm run dev
# runs on http://localhost:5173 (default Vite port)
```

Make sure your `.env` file (see below) is set up in the project root before starting the backend.

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# Redis (Upstash)
UPSTASH_REDIS_URL=your_redis_connection_url

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Bakong KHQR
BAKONG_ACCOUNT_ID=your_bakong_account_id
BAKONG_MERCHANT_NAME=your_merchant_name
BAKONG_MERCHANT_CITY=your_merchant_city
BAKONG_API_URL=bakong_api_base_url
BAKONG_TOKEN=your_bakong_api_token
```

> **Note:** None of these values are committed to the repo (`.env` is gitignored). You'll need your own credentials for MongoDB, Upstash, Cloudinary, and Bakong to run this locally.

## API Overview

All endpoints are prefixed with `/api`.

**Auth** — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Create a new account |
| POST | `/signin` | Log in |
| POST | `/logout` | Log out, clear cookies |
| POST | `/refresh-token` | Exchange refresh token for a new access token |
| GET | `/me` | Get the current logged-in user |

**Products** — `/api/products`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List products (pagination, category, search, sort) |
| GET | `/:id` | Get a single product |
| POST | `/` | Create a product *(admin only)* |
| PUT | `/:id` | Update a product *(admin only)* |
| DELETE | `/:id` | Delete a product *(admin only)* |

**Cart** — `/api/cart`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get the current user's cart |
| POST | `/` | Add an item to the cart |
| PUT | `/:id` | Update item quantity |
| DELETE | `/:id` | Remove one item |
| DELETE | `/` | Clear the entire cart |

**Payment** — `/api/payment`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/checkout` | Generate a Bakong KHQR QR code and create a pending order |
| GET | `/status/:orderId` | Poll the payment status of an order |
| POST | `/cancel/:orderId` | Cancel a pending order |

## Known Limitations / Roadmap

Being upfront about the current state — these are the next things worth tackling:

- Payment status polling currently runs as an in-memory `setTimeout` loop on the server. This works for a single-instance deployment but won't survive a server restart or scale across multiple instances. A DB-backed cron job (`node-cron` is already a dependency) would be a more production-robust approach.
- No `.env.example` file yet — planned addition so new contributors know which variables to set without digging through the code.
- Mobile nav and search overlay responsiveness are still being refined.
- No automated test suite yet.

## License

This project was built for learning and portfolio purposes.
