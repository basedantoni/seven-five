import { createTRPCRouter } from '../trpc';

import { accountRouter } from './accounts';
import { challengeRouter } from './challenges';
import { taskRouter } from './tasks';
import { taskLogRouter } from './taskLogs';

export const appRouter = createTRPCRouter({
  account: accountRouter,
  challenge: challengeRouter,
  task: taskRouter,
  taskLog: taskLogRouter,
});

export type AppRouter = typeof appRouter;
