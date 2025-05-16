import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import {
  insertTaskSchema,
  taskIdSchema,
  tasks,
  updateTaskSchema,
} from '@antho/db/schema';
import { eq } from 'drizzle-orm';

export const taskRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(tasks).limit(10);
  }),
  byId: protectedProcedure
    .input(taskIdSchema)
    .query(({ ctx, input: { id } }) => {
      return ctx.db.select().from(tasks).where(eq(tasks.id, id));
    }),
  create: protectedProcedure
    .input(insertTaskSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(tasks).values(input).returning();
    }),
  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db.update(tasks).set(updateData).where(eq(tasks.id, id));
    }),
  delete: protectedProcedure
    .input(taskIdSchema)
    .mutation(({ ctx, input: { id } }) => {
      return ctx.db.delete(tasks).where(eq(tasks.id, id));
    }),
} satisfies TRPCRouterRecord;
