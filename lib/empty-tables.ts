import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.resolve(import.meta.url, '../.env'),
});
neonConfig.fetchConnectionCache = true;

const client = neon(process.env['DATABASE_URL']!);

const db = drizzle(client, { schema });

async function reset() {
  const tableSchema = db._.schema;

  if (!tableSchema) {
    throw new Error('No table schema found');
  }

  console.log('🗑️ Emptying the entire database');
  const queries = Object.values(tableSchema).map((table) => {
    console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
    return sql.raw(`DELETE FROM ${table.dbName};`);
  });
  console.log('🛜 Sending delete queries');
  const result = await Promise.allSettled(
    queries.map(async (query) => {
      if (query) await db.execute(query);
    })
  );

  const error = result.filter(({ status }) => status === 'rejected');

  if (error.length) throw error;
  console.log('✅ Database emptied');
}

reset().catch((e) => {
  console.error(e);
});
