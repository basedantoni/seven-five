'use client';

import Link from 'next/link';
import { RouterOutputs } from '@antho/api';
import { ChallengeTaskForm, challengeTaskSchema } from '@antho/db/schema';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@antho/ui/components/select';
import { PlusIcon, X } from 'lucide-react';

import {
  useSuspenseQuery,
  useQueryClient,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { useTRPC } from '~/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';

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
  const form = useForm<ChallengeTaskForm>({
    resolver: zodResolver(challengeTaskSchema),
    defaultValues: {
      challenge: {
        name: '',
        startDate: new Date(),
        durationDays: 30,
      },
      tasks: [{ name: '', description: '' }],
    },
  });
  const queryClient = useQueryClient();

  const tasks = form.watch('tasks');

  const [showCustomDuration, setShowCustomDuration] = useState(false);

  const { mutate: createChallenge, isPending } = useMutation(
    trpc.challenge.createWithTasks.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.challenge.pathFilter());
        toast.success('Challenge created successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleSubmit = (data: ChallengeTaskForm) => {
    createChallenge(data);
  };

  const handleDurationChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomDuration(true);
    } else {
      setShowCustomDuration(false);
      form.setValue('challenge.durationDays', parseInt(value));
    }
  };

  const handleAddTask = () => {
    form.setValue('tasks', [
      ...form.getValues('tasks'),
      { name: '', description: '' },
    ]);
  };

  const handleRemoveTask = (index: number) => {
    form.setValue(
      'tasks',
      form.getValues('tasks').filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form
        className='space-y-3 p-2'
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className='flex justify-between'>
          <h2 className='text-2xl font-bold'>Create Challenge</h2>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
        <FormField
          control={form.control}
          name='challenge.name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value}
                  placeholder='Challenge Name'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='challenge.durationDays'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {showCustomDuration ? 'Custom Duration' : 'Duration'}
              </FormLabel>
              <FormControl>
                {showCustomDuration ? (
                  <Input
                    {...field}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                    type='number'
                    min={1}
                    max={365}
                  />
                ) : (
                  <Select
                    value={field.value?.toString() ?? ''}
                    onValueChange={handleDurationChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a duration' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='30'>30 days</SelectItem>
                      <SelectItem value='60'>60 days</SelectItem>
                      <SelectItem value='75'>75 days</SelectItem>
                      <SelectItem value='custom'>Custom</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className='w-full'
          onClick={handleAddTask}
          variant='secondary'
          size='sm'
          type='button'
          disabled={tasks.length >= 15}
        >
          <PlusIcon className='h-4 w-4' />
          Add Task
        </Button>
        {tasks.length >= 15 && (
          <p className='text-sm text-destructive'>
            You can only add up to 15 tasks
          </p>
        )}
        <div className='flex h-96 flex-col gap-2 overflow-y-auto'>
          {tasks.map((_, index) => (
            <div className='flex gap-2' key={index}>
              <FormField
                control={form.control}
                name={`tasks.${index}.name`}
                render={({ field }) => (
                  <FormItem className='flex-grow'>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        placeholder='Task name'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                onClick={() => handleRemoveTask(index)}
                variant='outline'
                size='icon'
                type='button'
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
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
    <div className='flex flex-col space-y-4'>
      <h2 className='text-2xl'>{challenge.name}</h2>
      <div className='flex flex-col space-y-2'>
        {challenge.challengeTasks.map(({ taskId, task }) => (
          <div key={taskId}>
            <h3>{task.name}</h3>
            <p className='text-sm text-gray-500'>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
