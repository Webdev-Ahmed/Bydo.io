import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";
import env from "./env";

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export { prisma };
