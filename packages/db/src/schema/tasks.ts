import { relations, sql } from 'drizzle-orm';
import { bigint, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { challengeTasks } from './challengeTasks';
import { taskLogs } from './taskLogs';

/**
 * Tasks represent a single action
 * that is part of a challenge
 */
export const tasks = pgTable('tasks', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const tasksRelations = relations(tasks, ({ many }) => ({
  challengeTasks: many(challengeTasks),
  taskLogs: many(taskLogs),
}));
