import { relations, sql } from 'drizzle-orm';
import { bigint, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { challengeTasks } from './challengeTasks';
import { taskLogs } from './taskLogs';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';

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

export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);
export const updateTaskSchema = createUpdateSchema(tasks).extend({
  id: z.number().min(1, 'ID is required'),
});
export const taskIdSchema = selectTaskSchema.pick({ id: true });

export type Task = typeof tasks.$inferSelect;
export type NewTask = z.infer<typeof insertTaskSchema>;
export type TaskId = z.infer<typeof taskIdSchema>['id'];
