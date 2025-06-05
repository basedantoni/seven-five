'use client';

import { useTRPC } from '~/trpc/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { format, addDays, isToday } from 'date-fns';
import { cn } from '@antho/ui/lib/utils';

import { Badge } from '@antho/ui/components/badge';
import { Button } from '@antho/ui/components/button';
import { Checkbox } from '@antho/ui/components/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@antho/ui/components/dialog';
import { Label } from '@antho/ui/components/label';
import { toast } from 'sonner';
import { prefetch } from '~/trpc/server';

export function ChallengeTaskGrid({ id }: { id: number }) {
  const trpc = useTRPC();
  const { data: challenge } = useQuery(
    trpc.challenge.byId.queryOptions({ id })
  );

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const days = useMemo(() => {
    return Array.from(
      { length: challenge?.durationDays ?? 0 },
      (_, i) => i + 1
    );
  }, [challenge]);

  const { mutate: createChallengeDay } = useMutation(
    trpc.challengeDay.create.mutationOptions({
      onSuccess: () => {
        toast.success('Task logged successfully');
        setSelectedTasks([]);
        setSelectedDay(null);
        setOpen(false);
      },
    })
  );

  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const handleLogTasks = () => {
    if (!challenge) return;

    selectedTasks.forEach((taskId) => {});
  };

  if (!challenge) {
    return <div>No challenge</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className='flex flex-col space-y-4'>
        <h2 className='text-2xl font-bold'>{challenge.name}</h2>
        <div className='flex flex-col space-y-1 max-w-md'>
          <p className='text-sm text-muted-foreground'>Daily Tasks:</p>
          <div className='flex flex-wrap gap-2'>
            {challenge.challengeTasks.map(({ taskId, task }) => (
              <Badge key={taskId} variant='outline'>
                {task.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className='max-w-sm flex flex-wrap justify-center gap-2'>
          {challenge.challengeDays.map(({ day, completed }) => (
            <DialogTrigger
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'hover:bg-secondary/80 cursor-pointer flex h-10 w-10 p-4 items-center justify-center rounded-md border border-dashed border-muted-foreground text-sm text-gray-500',
                isToday(addDays(challenge.startDate, day - 1)) &&
                  'border-solid',
                completed && 'bg-green-500'
              )}
            >
              <p>{day}</p>
            </DialogTrigger>
          ))}
        </div>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedDay ? `Day ${selectedDay}` : 'Daily Tasks'}
          </DialogTitle>
          <DialogDescription>
            {selectedDay
              ? `${format(
                  addDays(challenge.startDate, selectedDay - 1),
                  'MMM d, yyyy'
                )}`
              : ''}
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          {challenge.challengeTasks.map(({ taskId, task }) => (
            <ul key={taskId}>
              <li className='flex items-center gap-2'>
                <Checkbox
                  id={taskId.toString()}
                  checked={selectedTasks.includes(taskId)}
                  onCheckedChange={(checked) => {
                    setSelectedTasks((prev) =>
                      checked
                        ? [...prev, taskId]
                        : prev.filter((id) => id !== taskId)
                    );
                  }}
                />
                <Label htmlFor={taskId.toString()}>{task.name}</Label>
              </li>
            </ul>
          ))}
          {selectedDay &&
            isToday(addDays(challenge.startDate, selectedDay - 1)) && (
              <div className='flex justify-end'>
                <Button onClick={handleLogTasks}>Log Tasks</Button>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
