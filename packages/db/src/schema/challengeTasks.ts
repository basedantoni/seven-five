import { bigint, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { challenges } from './challenges';
import { tasks } from './tasks';

/**
 * ChallengeTasks is the join table between challenges and tasks.
 * It is used to track the order of
 * tasks in a challenge.
 */
export const challengeTasks = pgTable(
  'challenge_to_tasks',
  {
    challengeId: bigint('challenge_id', { mode: 'number' })
      .notNull()
      .references(() => challenges.id, { onDelete: 'cascade' }),
    taskId: bigint('task_id', { mode: 'number' })
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    ordinal: integer('ordinal').notNull().default(1),
  },
  (t) => [primaryKey({ columns: [t.challengeId, t.taskId] })]
);

export const challengeTasksRelations = relations(challengeTasks, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeTasks.challengeId],
    references: [challenges.id],
  }),
  task: one(tasks, {
    fields: [challengeTasks.taskId],
    references: [tasks.id],
  }),
}));
