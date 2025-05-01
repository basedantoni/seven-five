'use client';

import { Button } from '@antho/ui/components/button';
import { signout } from '~/app/(auth)/actions';

const SignOut = () => {
  return (
    <Button variant='outline' onClick={() => signout()}>
      Sign Out
    </Button>
  );
};

export default SignOut;
