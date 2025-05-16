import { sql } from 'drizzle-orm';
import { bigint, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { challengeTasks } from './challengeTasks';
import { accounts } from './accounts';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';

/**
 * Challenges represent long instances of
 * tasks that are completed over an
 * extended period of time
 */
export const challenges = pgTable('challenges', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  accountId: bigint('account_id', { mode: 'number' })
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  durationDays: integer('duration_days').notNull().default(75),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const challengesRelations = relations(challenges, ({ many, one }) => ({
  account: one(accounts, {
    fields: [challenges.accountId],
    references: [accounts.id],
  }),
  challengeTasks: many(challengeTasks),
}));

export const insertChallengeSchema = createInsertSchema(challenges);
export const selectChallengeSchema = createSelectSchema(challenges);
export const updateChallengeSchema = createUpdateSchema(challenges).extend({
  id: z.number().min(1, 'ID is required'),
});
export const challengeIdSchema = selectChallengeSchema.pick({ id: true });

export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = z.infer<typeof insertChallengeSchema>;
export type ChallengeId = z.infer<typeof challengeIdSchema>['id'];
