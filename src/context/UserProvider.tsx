import { Fetch, FetchToast } from '@/api/fetcher';
import { createContext, useContext, useEffect, useState } from 'react';
import { z } from 'zod';

export const registerSchema = z
  .object({
    nama: z.string().min(1, { message: 'Isi nama lengkap pengguna.' }),
    email: z.string().min(1, { message: 'Isi email pengguna.' }).email(),
    password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
    repeatPassword: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Password tidak sama.',
    path: ['repeatPassword'],
  });

export const updateSchema = z.object({
  id: z.number(),
  nama: z.string().min(1, { message: 'Isi nama lengkap pengguna.' }),
  email: z.string().min(1, { message: 'Isi email pengguna.' }).email(),
});

export const resetPasswordSchema = z
  .object({
    id: z.number(),
    newPassword: z.string().min(1, { message: 'Isi kolom password.' }),
    repeatPassword: z.string().min(1, { message: 'Isi kolom ulangi password.' }),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: 'Password tidak sama.',
    path: ['repeatPassword'],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

type Context = {
  // Fetch State
  loading: boolean;
  // Data State
  users: User[] | null;
  // Revalidate Data
  invalidate: () => Promise<void>;
  // add new meja
  registerUser: (data: RegisterSchema) => Promise<Response>;
  // update meja
  updateUser: (data: UpdateSchema) => Promise<Response>;
  // reset password
  resetPassword: (data: ResetPasswordSchema) => Promise<Response>;
};

export const UsersContext = createContext<Context>({} as Context);
export const useUsers = () => useContext(UsersContext);

export default function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FetchToast(fetchUsers)()
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const invalidate = async () => {
    await FetchToast(fetchUsers)().then((data) => setUsers(data));
  };

  const fetchUsers = async () => {
    const response = await Fetch('/api/users', {
      credentials: 'include',
    });
    const resBody = (await response.json()) as ApiResponse<User[]>;
    return resBody.data;
  };

  const registerUser = async (data: RegisterSchema) => {
    return await Fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        nama: data.nama,
        email: data.email,
        password: data.password,
      }),
    });
  };

  const updateUser = async (data: UpdateSchema) => {
    return await Fetch(`/api/users/${data.id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        nama: data.nama,
        email: data.email,
      }),
    });
  };

  const resetPassword = async (data: ResetPasswordSchema) => {
    return await Fetch(`/api/users/${data.id}/reset-password`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        password: data.newPassword,
      }),
    });
  };

  return (
    <UsersContext.Provider
      value={{
        loading,
        users,
        invalidate,
        registerUser,
        updateUser,
        resetPassword,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
