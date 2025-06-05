import {
  bigint,
  boolean,
  integer,
  pgTable,
  smallserial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { challenges } from './challenges';

export const challengeDays = pgTable('challenge_days', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  challengeId: bigint('challenge_id', { mode: 'number' })
    .notNull()
    .references(() => challenges.id, { onDelete: 'cascade' }),
  day: smallserial('day').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const challengeDayRelations = relations(challengeDays, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeDays.challengeId],
    references: [challenges.id],
  }),
}));
