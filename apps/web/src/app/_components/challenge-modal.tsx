'use client';

import { Button } from '@antho/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@antho/ui/components/dialog';

import { useState } from 'react';
import { RouterOutputs } from '@antho/api';
import { Plus } from 'lucide-react';
import { CreateChallengeForm } from '~/app/_components/challenge-form';

interface ChallengeModalProps {
  challenge?: RouterOutputs['challenge']['byId'];
  emptyState?: boolean;
}

export default function ChallengeModal({
  challenge,
  emptyState,
}: ChallengeModalProps) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!challenge?.id;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {emptyState ? (
          <Button variant='default' size='sm'>
            <Plus size={16} />
            New Challenge
          </Button>
        ) : (
          <Button
            variant={editing ? 'ghost' : 'outline'}
            size={editing ? 'sm' : 'icon'}
          >
            {editing ? 'Edit' : '+'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit' : 'Create'} Challenge</DialogTitle>
        </DialogHeader>
        <CreateChallengeForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
