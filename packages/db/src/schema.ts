import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

export const posts = pgTable('posts', {
  privateId: serial('private_id').primaryKey(),
  publicId: varchar('public_id', { length: 256 })
    .unique()
    .$defaultFn(() => nanoid()),
  title: text('title'),
  content: text('content'),
});

export const insertPostSchema = createInsertSchema(posts).omit({
  privateId: true,
  publicId: true,
});

export const selectPostSchema = createSelectSchema(posts)
  .omit({
    privateId: true,
  })
  .extend({
    publicId: z.string().min(1, 'Public ID is required'),
  });

export const updatePostSchema = createUpdateSchema(posts)
  .omit({
    privateId: true,
  })
  .extend({
    publicId: z.string().min(1, 'Public ID is required'),
  });

export const postIdSchema = selectPostSchema.pick({ publicId: true });

export type Post = typeof posts.$inferSelect;
export type NewPost = z.infer<typeof insertPostSchema>;
export type PostId = z.infer<typeof postIdSchema>['publicId'];
