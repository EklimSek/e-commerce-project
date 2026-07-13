import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis.js";

const makeLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
    store: new RedisStore({
      // ioredis exposes raw commands via .call(command, ...args)
      sendCommand: (...args) => redis.call(...args),
    }),
  });

// Strict — auth endpoints, prime brute-force/credential-stuffing targets
export const authLimiter = makeLimiter(
  10 * 60 * 1000, // 10 min
  5,
  "Too many login attempts. Try again later."
);

// Strict — checkout / cancel, prevents hammering Bakong via your API
export const paymentLimiter = makeLimiter(
  60 * 1000, // 1 min
  10,
  "Too many payment requests. Please slow down."
);

// Looser — general browsing/search
export const generalLimiter = makeLimiter(
  60 * 1000,
  100,
  "Too many requests. Please slow down."
);