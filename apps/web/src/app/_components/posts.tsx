'use client';

import Link from 'next/link';

import { RouterOutputs } from '@antho/api';
import { insertPostSchema, NewPost } from '@antho/db/schema';

import { Button } from '@antho/ui/components/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  useForm,
} from '@antho/ui/components/form';
import { Input } from '@antho/ui/components/input';
import { Textarea } from '@antho/ui/components/textarea';
import { toast } from '@antho/ui/components/sonner';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useTRPC } from '~/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';

export function PostList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: posts } = useSuspenseQuery(trpc.post.all.queryOptions());

  const { mutate: updatePost } = useMutation(
    trpc.post.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.post.pathFilter());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const { mutate: deletePost } = useMutation(
    trpc.post.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.post.pathFilter());
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  if (posts.length === 0) {
    return <p>No posts found</p>;
  }

  return (
    <>
      {posts.map((p) => (
        <div
          key={p.publicId}
          className='flex items-center justify-between space-y-4'
        >
          <Post post={p} />
          <div className='flex items-center gap-2'>
            <Button
              className='cursor-pointer'
              variant='outline'
              size='sm'
              onClick={() =>
                updatePost({ publicId: p.publicId, title: 'Updated' })
              }
            >
              Update
            </Button>
            <Button
              className='cursor-pointer'
              variant='destructive'
              size='sm'
              onClick={() => deletePost({ publicId: p.publicId })}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}

export function Post({ post }: { post: RouterOutputs['post']['all'][number] }) {
  return (
    <Link href={`/posts/${post.publicId}`}>
      <h1>{post.title}</h1>
    </Link>
  );
}

export function CreatePostForm() {
  const trpc = useTRPC();
  const form = useForm<NewPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.post.pathFilter());
      },
    })
  );

  return (
    <Form {...form}>
      <form
        className='space-y-3 p-2'
        onSubmit={form.handleSubmit((data) => createPost(data))}
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </form>
    </Form>
  );
}
