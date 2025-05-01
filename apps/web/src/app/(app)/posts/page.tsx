import { Suspense } from 'react';

import { HydrateClient, prefetch, trpc } from '~/trpc/server';
import { PostList, CreatePostForm } from '~/app/_components/posts';
export default async function PostsPage() {
  prefetch(trpc.post.all.queryOptions());

  return (
    <HydrateClient>
      <main className='w-full flex h-screen flex-col items-center py-24 space-y-8'>
        <div className='flex flex-col items-center justify-center space-y-2'>
          <h1 className='text-5xl font-extrabold tracking-tight sm:text-[5rem]'>
            Create Antho Repo
          </h1>

          <div className='w-full overflow-y-scroll'>
            <Suspense
              fallback={
                <div className='flex w-full flex-col gap-4'>
                  <p>Skeleton</p>
                </div>
              }
            >
              <h2 className='text-2xl font-bold'>Posts</h2>
              <PostList />
            </Suspense>
          </div>
        </div>
        <div className='w-full max-w-2xl overflow-y-scroll space-y-2'>
          <h2 className='text-2xl font-bold'>Create Post</h2>
          <CreatePostForm />
        </div>
      </main>
    </HydrateClient>
  );
}
