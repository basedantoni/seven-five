import { createTRPCRouter } from '../trpc';

import { accountRouter } from './accounts';
import { challengeRouter } from './challenges';
import { taskRouter } from './tasks';

export const appRouter = createTRPCRouter({
  account: accountRouter,
  challenge: challengeRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
