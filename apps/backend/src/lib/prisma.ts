import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client.js";
import env from "./env.js";

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export { prisma };
