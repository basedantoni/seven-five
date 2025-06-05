import { Suspense } from 'react';

import { HydrateClient, prefetch, trpc } from '~/trpc/server';
import { ChallengeList } from '~/app/_components/challenges';
import ChallengeModal from '~/app/_components/challenge-modal';

export default async function ChallengesPage() {
  prefetch(trpc.challenge.all.queryOptions());

  return (
    <HydrateClient>
      <main className='w-full flex flex-col sm:px-20 sm:py-24 gap-4'>
        <div className='flex flex-wrap gap-4 justify-center sm:flex-row sm:justify-between sm:items-center'>
          <h1 className='text-2xl font-bold'>Challenges</h1>
          <ChallengeModal emptyState />
        </div>
        <Suspense
          fallback={
            <div className='flex w-full flex-col gap-4'>
              <p>Skeleton</p>
            </div>
          }
        >
          <ChallengeList />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
