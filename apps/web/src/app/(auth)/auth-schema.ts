import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z
    .email({
      message: 'Invalid email address.',
    })
    .trim(),
  password: z.string().trim().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export const signUpSchema = z.object({
  email: z
    .email({
      message: 'Invalid email address.',
    })
    .trim(),
  password: z.string().trim().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});
