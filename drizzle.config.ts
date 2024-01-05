import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

const { env } = require('./env/parsed-env');

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
