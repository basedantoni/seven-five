import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { challengeDayTasks } from '../challengeDayTasks';
import { z } from 'zod/v4';

export const insertChallengeDayTaskSchema = createInsertSchema(
  challengeDayTasks,
  {
    completed: z.boolean().default(false),
    completedAt: z.date().optional(),
  }
);
export const selectChallengeDayTaskSchema =
  createSelectSchema(challengeDayTasks);
export const updateChallengeDayTaskSchema = createUpdateSchema(
  challengeDayTasks
).omit({
  challengeDayId: true,
  taskId: true,
});
export const challengeDayTaskIdSchema = selectChallengeDayTaskSchema.pick({
  id: true,
});

// Schema for update mutations - combines id with updateable fields
export const updateChallengeDayTaskInputSchema =
  updateChallengeDayTaskSchema.extend({
    id: z.number(),
  });

// Schema for bulk operations
export const toggleTaskCompletionSchema = z.object({
  challengeDayId: z.number(),
  taskId: z.number(),
  completed: z.boolean(),
});

export type ChallengeDayTask = typeof challengeDayTasks.$inferSelect;
export type NewChallengeDayTask = z.infer<typeof insertChallengeDayTaskSchema>;
export type ChallengeDayTaskId = z.infer<typeof challengeDayTaskIdSchema>['id'];
