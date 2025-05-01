import Button from '~/app/_components/ui/button';

import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { supabase, useUser } from '~/lib/supabase';

export default function MobileAuth() {
  const router = useRouter();

  const { user, isLoading } = useUser();

  const { mutate: signOut, isPending: signOutLoading } = useMutation({
    mutationFn: () => supabase.auth.signOut({ scope: 'local' }),
    onSuccess: () => {
      router.replace('/login');
    },
  });

  return (
    <>
      <Button
        label={user ? 'Sign Out' : 'Sign In'}
        mode='ghost'
        onPress={() => (user ? signOut() : router.push('/login'))}
      />
    </>
  );
}
