import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import {
  challengeDays,
  insertChallengeDaySchema,
  updateChallengeDaySchema,
} from '@antho/db/schema';

export const challengeDayRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.query.challengeDays.findMany();
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch challenge days',
        cause: error,
      });
    }
  }),
  create: protectedProcedure
    .input(insertChallengeDaySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.insert(challengeDays).values({
          ...input,
          challengeId: input.challengeId,
          day: input.day,
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create challenge day',
          cause: error,
        });
      }
    }),
  update: protectedProcedure
    .input(updateChallengeDaySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.update(challengeDays).set(input);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update challenge day',
          cause: error,
        });
      }
    }),
});
