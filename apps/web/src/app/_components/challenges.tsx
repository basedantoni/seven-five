'use client';

import Link from 'next/link';
import { RouterOutputs } from '@antho/api';

import {
  useSuspenseQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import { useTRPC } from '~/trpc/react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@antho/ui/components/card';

export function ChallengeCard({
  challenge,
}: {
  challenge: RouterOutputs['challenge']['all'][number];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery(
      trpc.challenge.byId.queryOptions({ id: challenge.id })
    );
  };

  return (
    <Link onMouseEnter={handleMouseEnter} href={`/challenges/${challenge.id}`}>
      <Card>
        <CardHeader className='flex justify-between items-start'>
          <div className='flex flex-col gap-1'>
            <CardTitle className='truncate xl:pb-1 xl:max-w-[140px]'>
              {challenge.name}
            </CardTitle>
            <CardDescription>{challenge.durationDays} days</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

export function ChallengeList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: challenges } = useSuspenseQuery(
    trpc.challenge.all.queryOptions()
  );

  const { mutate: updateChallenge } = useMutation(
    trpc.challenge.update.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.challenge.pathFilter()),
    })
  );

  const { mutate: deleteChallenge } = useMutation(
    trpc.challenge.delete.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.challenge.pathFilter()),
    })
  );

  if (challenges.length === 0) {
    return <div>No challenges</div>;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
}
