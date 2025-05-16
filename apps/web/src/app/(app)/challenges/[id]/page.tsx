import { getQueryClient, HydrateClient, trpc } from '~/trpc/server';
import { ChallengeTasks } from '~/app/_components/challenges';

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
      <main className='flex w-full h-screen flex-col items-center py-24 space-y-8'>
        <h1 className='text-2xl font-bold'>Hello</h1>
        <ChallengeTasks id={parseInt(id)} />
      </main>
    </HydrateClient>
  );
}
