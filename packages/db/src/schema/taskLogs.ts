import { relations, sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  foreignKey,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { challengeTasks } from './challengeTasks';
import { accounts } from './accounts';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';

/**
 * TaskLogs represent a single log of a task.
 * It is used to track the completion of a task.
 */
export const taskLogs = pgTable(
  'task_logs',
  {
    id: bigint('id', { mode: 'number' })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    challengeId: bigint('challenge_id', { mode: 'number' }).notNull(),
    taskId: bigint('task_id', { mode: 'number' }).notNull(),
    completed: boolean('completed').notNull().default(false),
    details: text('details'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    foreignKey({
      columns: [t.challengeId, t.taskId],
      foreignColumns: [challengeTasks.challengeId, challengeTasks.taskId],
    }),
  ]
);

export const taskLogsRelations = relations(taskLogs, ({ one }) => ({
  challengeTask: one(challengeTasks, {
    fields: [taskLogs.challengeId, taskLogs.taskId],
    references: [challengeTasks.challengeId, challengeTasks.taskId],
  }),
}));
