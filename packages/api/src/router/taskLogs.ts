import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import {
  insertTaskLogSchema,
  taskLogIdSchema,
  taskLogs,
  updateTaskLogSchema,
} from '@antho/db/schema';
import { eq } from 'drizzle-orm';

export const taskLogRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(taskLogs).limit(10);
  }),
  byId: protectedProcedure
    .input(taskLogIdSchema)
    .query(({ ctx, input: { id } }) => {
      return ctx.db.select().from(taskLogs).where(eq(taskLogs.id, id));
    }),
  create: protectedProcedure
    .input(insertTaskLogSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(taskLogs).values(input).returning();
    }),
  update: protectedProcedure
    .input(updateTaskLogSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db.update(taskLogs).set(updateData).where(eq(taskLogs.id, id));
    }),
  delete: protectedProcedure
    .input(taskLogIdSchema)
    .mutation(({ ctx, input: { id } }) => {
      return ctx.db.delete(taskLogs).where(eq(taskLogs.id, id));
    }),
} satisfies TRPCRouterRecord;
