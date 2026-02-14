import { z, ZodError } from "zod";
import { config } from "dotenv";

config();

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().default("file:./dev.db"),
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
  process.exit(1);
}

export default env;
