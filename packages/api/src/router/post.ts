import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure } from '../trpc';
import {
  insertPostSchema,
  postIdSchema,
  posts,
  updatePostSchema,
} from '@antho/db/schema';
import { eq } from 'drizzle-orm';

export const postRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(posts).limit(10);
  }),
  byId: protectedProcedure
    .input(postIdSchema)
    .query(({ ctx, input: { publicId } }) => {
      return ctx.db.select().from(posts).where(eq(posts.publicId, publicId));
    }),
  create: protectedProcedure
    .input(insertPostSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(posts).values(input).returning();
    }),
  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(({ ctx, input }) => {
      const { publicId, ...updateData } = input;

      return ctx.db
        .update(posts)
        .set(updateData)
        .where(eq(posts.publicId, publicId));
    }),
  delete: protectedProcedure
    .input(postIdSchema)
    .mutation(({ ctx, input: { publicId } }) => {
      return ctx.db.delete(posts).where(eq(posts.publicId, publicId));
    }),
} satisfies TRPCRouterRecord;
