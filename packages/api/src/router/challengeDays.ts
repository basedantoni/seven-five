import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import {
  challengeDays,
  challengeDayTasks,
  insertChallengeDaySchema,
  updateChallengeDayInputSchema,
  challengeDayIdSchema,
  toggleTaskCompletionSchema,
} from '@antho/db/schema';
import { eq, and } from '@antho/db';
import { z } from 'zod/v4';

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
    .input(updateChallengeDayInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      try {
        return await ctx.db
          .update(challengeDays)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(challengeDays.id, id));
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update challenge day',
          cause: error,
        });
      }
    }),
  toggleTaskCompletion: protectedProcedure
    .input(toggleTaskCompletionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if a record already exists
        const existing = await ctx.db.query.challengeDayTasks.findFirst({
          where: and(
            eq(challengeDayTasks.challengeDayId, input.challengeDayId),
            eq(challengeDayTasks.taskId, input.taskId)
          ),
        });

        if (existing) {
          // Update existing record
          return await ctx.db
            .update(challengeDayTasks)
            .set({
              completed: input.completed,
              completedAt: input.completed ? new Date() : null,
              updatedAt: new Date(),
            })
            .where(eq(challengeDayTasks.id, existing.id));
        } else {
          // Create new record
          return await ctx.db.insert(challengeDayTasks).values({
            challengeDayId: input.challengeDayId,
            taskId: input.taskId,
            completed: input.completed,
            completedAt: input.completed ? new Date() : null,
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to toggle task completion',
          cause: error,
        });
      }
    }),
  bulkUpdateTaskCompletions: protectedProcedure
    .input(
      z.object({
        challengeDayId: z.number(),
        completedTaskIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get all tasks for this challenge day
        const challengeDay = await ctx.db.query.challengeDays.findFirst({
          where: eq(challengeDays.id, input.challengeDayId),
          with: {
            challenge: {
              with: {
                challengeTasks: true,
              },
            },
          },
        });

        if (!challengeDay) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Challenge day not found',
          });
        }

        const allTaskIds = challengeDay.challenge.challengeTasks.map(
          (ct) => ct.taskId
        );

        // Delete existing task completions for this day
        await ctx.db
          .delete(challengeDayTasks)
          .where(eq(challengeDayTasks.challengeDayId, input.challengeDayId));

        // Insert new task completions
        if (input.completedTaskIds.length > 0) {
          await ctx.db.insert(challengeDayTasks).values(
            input.completedTaskIds.map((taskId) => ({
              challengeDayId: input.challengeDayId,
              taskId,
              completed: true,
              completedAt: new Date(),
            }))
          );
        }

        // Update the challenge day's completed status
        const isFullyCompleted =
          allTaskIds.length === input.completedTaskIds.length;
        await ctx.db
          .update(challengeDays)
          .set({
            completed: isFullyCompleted,
            updatedAt: new Date(),
          })
          .where(eq(challengeDays.id, input.challengeDayId));

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update task completions',
          cause: error,
        });
      }
    }),
});
