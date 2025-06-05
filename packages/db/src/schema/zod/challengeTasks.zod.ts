import { insertChallengeSchema } from '../zod/challenges.zod';
import { insertTaskSchema } from '../zod/tasks.zod';
import { challengeTasks } from '../challengeTasks';
import { z } from 'zod/v4';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const insertChallengeTaskSchema = createInsertSchema(challengeTasks);
export const selectChallengeTaskSchema = createSelectSchema(challengeTasks);
export const updateChallengeTaskSchema = createUpdateSchema(
  challengeTasks
).extend({
  challengeId: z.number().min(1, 'Challenge ID is required'),
  taskId: z.number().min(1, 'Task ID is required'),
});
export const challengeTaskIdSchema = selectChallengeTaskSchema.pick({
  challengeId: true,
  taskId: true,
});

export type ChallengeTask = typeof challengeTasks.$inferSelect;
export type NewChallengeTask = z.infer<typeof insertChallengeTaskSchema>;
export type ChallengeTaskId = z.infer<typeof challengeTaskIdSchema>;

export const challengeTaskSchema = z.object({
  challenge: insertChallengeSchema,
  tasks: z.array(insertTaskSchema).min(1).max(15),
});
export type ChallengeTaskForm = z.infer<typeof challengeTaskSchema>;
