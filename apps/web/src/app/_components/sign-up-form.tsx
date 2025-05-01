'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@antho/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@antho/ui/components/card';
import { Input } from '@antho/ui/components/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from '@antho/ui/components/form';

import { loginWithGoogle, signup } from '~/app/(auth)/actions';
import { signUpSchema } from '~/app/(auth)/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type IconProps = React.HTMLAttributes<SVGElement>;
const Icons = {
  google: (props: IconProps) => (
    <svg role='img' viewBox='0 0 24 24' {...props}>
      <path
        fill='currentColor'
        d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
      />
    </svg>
  ),
};

export function SignUpForm() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    await signup(formData);
  };

  return (
    <div className='grid w-full grow items-center px-4 sm:justify-center'>
      <Card className='w-full sm:w-96'>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your credentials to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-y-4'>
          <Button
            onClick={() => loginWithGoogle()}
            size='sm'
            variant='outline'
            type='button'
          >
            <Icons.google className='mr-2 size-4' />
            Sign up with Google
          </Button>

          <p className='flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border'>
            or
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <FormControl>
                      <Input id='email' type='text' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <FormControl>
                      <Input id='password' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Sign up
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <div className='grid w-full gap-y-4'>
            <Button variant='link' size='sm' asChild>
              <Link href='/login'>Already have an account? Login</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
