import { uuid, text, bigint, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { challenges } from './challenges';
import { authUsers } from 'drizzle-orm/supabase';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';

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

export const insertAccountSchema = createInsertSchema(accounts);
export const selectAccountSchema = createSelectSchema(accounts);
export const updateAccountSchema = createUpdateSchema(accounts).extend({
  id: z.number().min(1, 'ID is required'),
});
export const accountIdSchema = selectAccountSchema.pick({ id: true });

export type Account = typeof accounts.$inferSelect;
export type NewAccount = z.infer<typeof insertAccountSchema>;
export type AccountId = z.infer<typeof accountIdSchema>['id'];
