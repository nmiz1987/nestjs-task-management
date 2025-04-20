import { z } from 'zod';

export enum configEnum {
  STAGE = 'STAGE',
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_DATABASE = 'DB_DATABASE',
  JWT_SECRET = 'JWT_SECRET',
}
export const configSchema = z.object({
  [configEnum.STAGE]: z.enum(['dev', 'prod']),
  [configEnum.DB_HOST]: z.string(),
  [configEnum.DB_PORT]: z.string(),
  [configEnum.DB_USERNAME]: z.string(),
  [configEnum.DB_PASSWORD]: z.string(),
  [configEnum.DB_DATABASE]: z.string(),
  [configEnum.JWT_SECRET]: z.string().min(4),
});

export type Config = z.infer<typeof configSchema>;
