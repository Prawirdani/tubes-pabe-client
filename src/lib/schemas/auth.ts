import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().min(1, { message: 'Mohon isi kolom email' }).email(),
  password: z.string().min(1, { message: 'Mohon isi kolom password' }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
