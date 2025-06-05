'use client';

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

import { ChallengeTaskForm, challengeTaskSchema } from '@antho/db/schema';
import { useTRPC } from '~/trpc/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

interface CreateChallengeFormProps {
  closeModal?: () => void;
}

export function CreateChallengeForm({ closeModal }: CreateChallengeFormProps) {
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
      onSuccess: async ({ challengeId }) => {
        await queryClient.invalidateQueries(trpc.challenge.pathFilter());

        if (closeModal) closeModal();
        toast.success('Challenge created successfully');
        form.reset();
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
      <form className='space-y-3' onSubmit={form.handleSubmit(handleSubmit)}>
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
        <div className='flex flex-col h-44 gap-2 overflow-y-auto p-1'>
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
        <div className='flex justify-end'>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
