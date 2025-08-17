import { FastifyInstance } from "fastify";
import { prisma } from "../lib/db.js";
import { z } from "zod";
import crypto from "node:crypto";

const creds = z.object({ email: z.string().email(), password: z.string().min(6) });

export default async function auth(app: FastifyInstance) {
  app.post("/register", async (req, reply) => {
    const { email, password } = creds.parse(req.body);
    const user = await prisma.user.create({ data: { email, password: crypto.createHash("sha256").update(password).digest("hex") } });
    const token = app.jwt.sign({ sub: user.id, email });
    return reply.send({ token });
  });

  app.post("/login", async (req, reply) => {
    const { email, password } = creds.parse(req.body);
    const pwd = crypto.createHash("sha256").update(password).digest("hex");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== pwd) return reply.code(401).send({ error: "invalid credentials" });
    return reply.send({ token: app.jwt.sign({ sub: user.id, email }) });
  });
}
