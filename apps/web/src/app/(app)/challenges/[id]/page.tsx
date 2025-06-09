import { getQueryClient, HydrateClient, trpc } from '~/trpc/server';
import { ChallengeTaskGrid } from '~/app/_components/challenge-task-grid';

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.challenge.byId.queryOptions({ id: parseInt(id) })
  );

  return (
    <HydrateClient>
      <main className='flex w-full h-screen flex-col items-center px-4 py-6 sm:py-24 space-y-8'>
        <ChallengeTaskGrid id={parseInt(id)} />
      </main>
    </HydrateClient>
  );
}
