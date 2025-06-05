import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { challengeDays } from '../challengeDays';
import { z } from 'zod/v4';

export const insertChallengeDaySchema = createInsertSchema(challengeDays, {
  day: z.number().min(1, 'Day must be at least 1'),
  completed: z.boolean().default(false),
});
export const selectChallengeDaySchema = createSelectSchema(challengeDays);
export const updateChallengeDaySchema = createUpdateSchema(challengeDays)
  .extend({
    id: z.number().min(1, 'ID is required'),
  })
  .omit({
    challengeId: true,
  });
export const challengeDayIdSchema = selectChallengeDaySchema.pick({
  id: true,
});

export type ChallengeDay = typeof challengeDays.$inferSelect;
export type NewChallengeDay = z.infer<typeof insertChallengeDaySchema>;
export type ChallengeDayId = z.infer<typeof challengeDayIdSchema>['id'];
