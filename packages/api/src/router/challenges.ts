import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import {
  insertChallengeSchema,
  challengeIdSchema,
  challenges,
  updateChallengeSchema,
} from '@antho/db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const challengeRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.query.challenges.findMany({
        with: {
          challengeTasks: {
            with: {
              task: true,
            },
          },
        },
        where: eq(challenges.accountId, ctx.account.id),
      });
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch challenges',
        cause: error,
      });
    }
  }),
  byId: protectedProcedure
    .input(challengeIdSchema)
    .query(async ({ ctx, input: { id } }) => {
      try {
        return await ctx.db.query.challenges.findFirst({
          where: eq(challenges.id, id),
          with: {
            challengeTasks: {
              with: {
                task: true,
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch challenge',
          cause: error,
        });
      }
    }),
  create: protectedProcedure
    .input(insertChallengeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.insert(challenges).values(input).returning();
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create challenge',
          cause: error,
        });
      }
    }),
  update: protectedProcedure
    .input(updateChallengeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        return await ctx.db
          .update(challenges)
          .set(updateData)
          .where(eq(challenges.id, id));
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update challenge',
          cause: error,
        });
      }
    }),
  delete: protectedProcedure
    .input(challengeIdSchema)
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return await ctx.db.delete(challenges).where(eq(challenges.id, id));
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete challenge',
          cause: error,
        });
      }
    }),
} satisfies TRPCRouterRecord;
