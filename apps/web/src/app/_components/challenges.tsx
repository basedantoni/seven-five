'use client';

import { RouterOutputs } from '@antho/api';
import { NewChallenge, insertChallengeSchema } from '@antho/db/schema';
import { Button } from '@antho/ui/components/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  useForm,
  FormMessage,
} from '@antho/ui/components/form';
import { Input } from '@antho/ui/components/input';
import { Textarea } from '@antho/ui/components/textarea';
import Link from 'next/link';

import {
  useSuspenseQuery,
  useQueryClient,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { useTRPC } from '~/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';

export function ChallengeCard({
  challenge,
}: {
  challenge: RouterOutputs['challenge']['all'][number];
}) {
  return (
    <Link href={`/challenges/${challenge.id}`}>
      <div>{challenge.name}</div>
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
    <>
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className='flex items-center justify-between space-y-4'
        >
          <ChallengeCard challenge={challenge} />
          <div className='flex items-center gap-2'>
            <Button
              className='cursor-pointer'
              variant='outline'
              size='sm'
              onClick={() =>
                updateChallenge({ id: challenge.id, name: 'New Name' })
              }
            >
              Update
            </Button>
            <Button
              className='cursor-pointer'
              variant='destructive'
              size='sm'
              onClick={() => deleteChallenge({ id: challenge.id })}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}

export function CreateChallengeForm() {
  const trpc = useTRPC();
  const form = useForm<NewChallenge>({
    resolver: zodResolver(insertChallengeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  const queryClient = useQueryClient();
  console.log(form.formState.errors);

  const { mutate: createChallenge, isPending } = useMutation(
    trpc.challenge.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.challenge.pathFilter());
      },
    })
  );

  return (
    <Form {...form}>
      <form
        className='space-y-3 p-2'
        onSubmit={form.handleSubmit((data) => createChallenge(data))}
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
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

export function ChallengeTasks({ id }: { id: number }) {
  const trpc = useTRPC();
  const { data: challenge } = useQuery(
    trpc.challenge.byId.queryOptions({ id })
  );

  if (!challenge) {
    return <div>No challenge</div>;
  }

  return (
    <div>
      <h2>{challenge.name}</h2>
    </div>
  );
}
