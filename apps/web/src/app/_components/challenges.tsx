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
      <Card className='min-w-xs'>
        <CardHeader>
          <CardTitle>{challenge.name}</CardTitle>
          <CardDescription>{challenge.durationDays} days</CardDescription>
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
    <div className='flex flex-wrap gap-4 justify-center sm:justify-start'>
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
}
