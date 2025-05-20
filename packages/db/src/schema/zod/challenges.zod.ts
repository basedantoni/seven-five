import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { challenges } from '../challenges';
import { z } from 'zod';

export const insertChallengeSchema = createInsertSchema(challenges)
  .omit({
    accountId: true,
  })
  .extend({
    name: z.string().min(1, 'Challenge name is required'),
    durationDays: z.number().min(1, 'Duration must be at least 1 day'),
  });
export const selectChallengeSchema = createSelectSchema(challenges);
export const updateChallengeSchema = createUpdateSchema(challenges).extend({
  id: z.number().min(1, 'ID is required'),
});
export const challengeIdSchema = selectChallengeSchema.pick({ id: true });

export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = z.infer<typeof insertChallengeSchema>;
export type ChallengeId = z.infer<typeof challengeIdSchema>['id'];
