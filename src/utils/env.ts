import { z } from "zod";
import "dotenv/config";

const schema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_PUBLIC_KEY: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  EMAIL_HOST: z.string(),
});

const env = schema.parse(process.env);
export { env };
