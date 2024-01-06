import { object, string, TypeOf } from 'zod';

const EnvSchema = object({
  DATABASE_URL: string(),
  GITHUB_CLIENT_ID: string(),
  GITHUB_CLIENT_SECRET: string(),
  GOOGLE_CLIENT_ID: string(),
  GOOGLE_CLIENT_SECRET: string(),
});

const env = EnvSchema.parse(process.env);
export type EnviromentVariables = TypeOf<typeof EnvSchema>;
export { env };
