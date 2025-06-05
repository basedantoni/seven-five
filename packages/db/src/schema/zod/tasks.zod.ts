import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { tasks } from '../tasks';
import { z } from 'zod/v4';

export const insertTaskSchema = createInsertSchema(tasks).extend({
  name: z.string().min(1, 'Name is required'),
});
export const selectTaskSchema = createSelectSchema(tasks);
export const updateTaskSchema = createUpdateSchema(tasks).extend({
  id: z.number().min(1, 'ID is required'),
});
export const taskIdSchema = selectTaskSchema.pick({ id: true });

export type Task = typeof tasks.$inferSelect;
export type NewTask = z.infer<typeof insertTaskSchema>;
export type TaskId = z.infer<typeof taskIdSchema>['id'];
