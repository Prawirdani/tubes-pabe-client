import { z } from 'zod';

export const userRegisterSchema = z
  .object({
    nama: z.string().min(1, { message: 'Isi nama lengkap pengguna.' }),
    email: z.string().min(1, { message: 'Isi email pengguna.' }).email({ message: 'Email tidak valid.' }),
    password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
    repeatPassword: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Password tidak sama.',
    path: ['repeatPassword'],
  });

export const userUpdateSchema = z.object({
  nama: z.string().min(1, { message: 'Isi nama lengkap pengguna.' }),
  email: z.string().min(1, { message: 'Isi email pengguna.' }).email({ message: 'Email tidak valid.' }),
});

export const userResetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, { message: 'Minimal 6 karakter.' }),
    repeatPassword: z.string().min(6, { message: 'Minimal 6 karakter.' }),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: 'Password tidak sama.',
    path: ['repeatPassword'],
  });

export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
export type UserResetPasswordSchema = z.infer<typeof userResetPasswordSchema>;
