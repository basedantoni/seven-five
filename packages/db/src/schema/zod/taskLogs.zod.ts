import { taskLogs } from '../taskLogs';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';

export const insertTaskLogSchema = createInsertSchema(taskLogs);
export const selectTaskLogSchema = createSelectSchema(taskLogs);
export const updateTaskLogSchema = createUpdateSchema(taskLogs).extend({
  id: z.number().min(1, 'ID is required'),
});
export const taskLogIdSchema = selectTaskLogSchema.pick({ id: true });

export type TaskLog = typeof taskLogs.$inferSelect;
export type NewTaskLog = z.infer<typeof insertTaskLogSchema>;
export type TaskLogId = z.infer<typeof taskLogIdSchema>;
