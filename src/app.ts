import Fastify from "fastify";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import health from "./routes/health.js";
import auth from "./routes/auth.js";
import wallets from "./routes/wallets.js";
import transfers from "./routes/transfers.js";
import webhooks from "./routes/webhooks.js";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(rateLimit, { max: Number(process.env.RATE_LIMIT_MAX || 100), timeWindow: "1 minute" });
  app.register(jwt, { secret: process.env.JWT_SECRET || "dev-secret" });

  app.register(health, { prefix: "/health" });
  app.register(auth, { prefix: "/auth" });
  app.register(wallets, { prefix: "/wallets" });
  app.register(transfers, { prefix: "/transfers" });
  app.register(webhooks, { prefix: "/webhooks" });

  return app;
}
