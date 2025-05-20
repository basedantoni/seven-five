import { accounts } from '../accounts';
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';

export const insertAccountSchema = createInsertSchema(accounts);
export const selectAccountSchema = createSelectSchema(accounts);
export const updateAccountSchema = createUpdateSchema(accounts).extend({
  id: z.number().min(1, 'ID is required'),
});
export const accountIdSchema = selectAccountSchema.pick({ id: true });

export type Account = typeof accounts.$inferSelect;
export type NewAccount = z.infer<typeof insertAccountSchema>;
export type AccountId = z.infer<typeof accountIdSchema>['id'];
