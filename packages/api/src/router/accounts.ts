import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import {
  insertAccountSchema,
  accountIdSchema,
  accounts,
  updateAccountSchema,
} from '@antho/db/schema';
import { eq } from 'drizzle-orm';

export const accountRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(accounts).limit(10);
  }),
  byId: protectedProcedure
    .input(accountIdSchema)
    .query(({ ctx, input: { id } }) => {
      return ctx.db.select().from(accounts).where(eq(accounts.id, id));
    }),
  create: protectedProcedure
    .input(insertAccountSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(accounts).values(input).returning();
    }),
  update: protectedProcedure
    .input(updateAccountSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db.update(accounts).set(updateData).where(eq(accounts.id, id));
    }),
  delete: protectedProcedure
    .input(accountIdSchema)
    .mutation(({ ctx, input: { id } }) => {
      return ctx.db.delete(accounts).where(eq(accounts.id, id));
    }),
} satisfies TRPCRouterRecord;
