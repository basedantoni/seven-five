import {
  bigint,
  boolean,
  pgTable,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { challengeDays } from './challengeDays';
import { tasks } from './tasks';

export const challengeDayTasks = pgTable(
  'challenge_day_tasks',
  {
    id: bigint('id', { mode: 'number' })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    challengeDayId: bigint('challenge_day_id', { mode: 'number' })
      .notNull()
      .references(() => challengeDays.id, { onDelete: 'cascade' }),
    taskId: bigint('task_id', { mode: 'number' })
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    completed: boolean('completed').notNull().default(false),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    challengeDayTaskUnique: unique().on(table.challengeDayId, table.taskId),
  })
);

export const challengeDayTaskRelations = relations(
  challengeDayTasks,
  ({ one }) => ({
    challengeDay: one(challengeDays, {
      fields: [challengeDayTasks.challengeDayId],
      references: [challengeDays.id],
    }),
    task: one(tasks, {
      fields: [challengeDayTasks.taskId],
      references: [tasks.id],
    }),
  })
);
