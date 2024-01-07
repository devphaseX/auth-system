import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  primaryKey,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

import type { AdapterAccount } from '@auth/core/adapters';

const userRole = pgEnum('user_role', ['admin', 'user']);
const users = pgTable('user', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }),
  email: varchar('email', { length: 256 }).unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: varchar('image', { length: 256 }),
  role: userRole('role').default('user'),
  passwordHashed: varchar('password', { length: 256 }),
  passwordSalt: varchar('password_salt', { length: 256 }),
});

const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

const passwordTokens = pgTable(
  'passwordToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export {
  users,
  passwordTokens,
  accounts,
  sessions,
  verificationTokens,
  userRole,
};
