import { uuid, text, bigint, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { challenges } from './challenges';
import { authUsers } from 'drizzle-orm/supabase';

export const accounts = pgTable('accounts', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  fullName: text('full_name').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  challenges: many(challenges),
}));
