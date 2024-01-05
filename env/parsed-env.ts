import { object, string, TypeOf } from 'zod';

const EnvSchema = object({ DATABASE_URL: string() });

const env = EnvSchema.parse(process.env);
export type EnviromentVariables = TypeOf<typeof EnvSchema>;
export { env };
