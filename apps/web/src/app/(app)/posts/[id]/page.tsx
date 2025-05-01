import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@antho/ui/components/card';
import { notFound } from 'next/navigation';

import { getQueryClient, HydrateClient, trpc } from '~/trpc/server';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const result = await queryClient.fetchQuery(
    trpc.post.byId.queryOptions({ publicId: id })
  );
  const post = result[0];

  if (!post) {
    notFound();
  }

  return (
    <HydrateClient>
      <main className='container flex h-screen flex-col items-center py-24 space-y-8'>
        <Card className='w-96'>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {post.content?.length ? post.content : 'No content'}
          </CardContent>
        </Card>
      </main>
    </HydrateClient>
  );
}
