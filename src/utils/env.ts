import { z } from "zod";
import "dotenv/config";

const schema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
});

const env = schema.parse(process.env);
export { env };
