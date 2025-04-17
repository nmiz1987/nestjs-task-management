import { z } from 'zod';

export const configSchema = z.object({
  STAGE: z.enum(['dev', 'prod']),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  JWT_SECRET: z.string().min(4),
});

export type Config = z.infer<typeof configSchema>;
