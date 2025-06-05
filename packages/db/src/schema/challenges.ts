import { sql } from 'drizzle-orm';
import { bigint, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { challengeTasks } from './challengeTasks';
import { accounts } from './accounts';
import { challengeDays } from './challengeDays';

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
  name: text('name').notNull().unique(),
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
  challengeDays: many(challengeDays),
}));
