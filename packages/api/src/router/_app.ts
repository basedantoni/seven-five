import { createTRPCRouter } from '../trpc';

import { accountRouter } from './accounts';
import { challengeRouter } from './challenges';
import { challengeDayRouter } from './challengeDays';
import { taskRouter } from './tasks';

export const appRouter = createTRPCRouter({
  account: accountRouter,
  challenge: challengeRouter,
  challengeDay: challengeDayRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
