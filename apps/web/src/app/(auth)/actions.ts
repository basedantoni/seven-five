'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@antho/auth/server';

import { loginSchema, signUpSchema } from '~/app/(auth)/auth-schema';

export type FormState = {
  message: string;
  fields?: Record<string, string>;
};

export async function login(data: FormData): Promise<FormState> {
  const supabase = await createClient();

  const formData = Object.fromEntries(data);
  const parsed = loginSchema.safeParse(formData);

  if (!parsed.success) {
    return { message: 'Invalid email or password', fields: parsed.data };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { message: error.message, fields: parsed.data };
  }

  revalidatePath('/', 'layout');
  redirect('/posts');
}

export async function signup(data: FormData): Promise<FormState> {
  const supabase = await createClient();

  const formData = Object.fromEntries(data);
  const parsed = signUpSchema.safeParse(formData);

  if (!parsed.success) {
    return { message: 'Invalid email or password', fields: parsed.data };
  }

  const { error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    return { message: error.message, fields: parsed.data };
  }

  revalidatePath('/', 'layout');
  redirect('/posts');
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: 'local' });
  redirect('/');
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/api/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(data.url);
}
