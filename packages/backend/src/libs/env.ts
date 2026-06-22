import { z, ZodError } from "zod";
import { config } from "dotenv";

config();

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4008),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string().optional(),
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.error("❌ Invalid env:");
  console.error(z.flattenError(error).fieldErrors);
  // Throwing (rather than process.exit) lets this surface as a clean
  // request-time error on serverless platforms like Vercel, instead of
  // killing the function process during a cold start.
  throw new Error("Invalid environment configuration. See logs above.");
}

export default env;
