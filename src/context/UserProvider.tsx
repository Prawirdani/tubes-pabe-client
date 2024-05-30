import { Fetch, FetchToast } from '@/api/fetcher';
import { UserRegisterSchema, UserResetPasswordSchema, UserUpdateSchema } from '@/lib/schemas/user';
import { createContext, useContext, useEffect, useState } from 'react';

type Context = {
  // Fetch State
  loading: boolean;
  // Data State
  users: User[];
  // Revalidate Data
  invalidate: () => Promise<void>;
  // add new meja
  registerUser: (data: UserRegisterSchema) => Promise<Response>;
  // update meja
  updateUser: (data: UserUpdateSchema) => Promise<Response>;
  // reset password
  resetPassword: (data: UserResetPasswordSchema) => Promise<Response>;
};

export const UsersContext = createContext<Context>({} as Context);
export const useUsers = () => useContext(UsersContext);

export default function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
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

  const registerUser = async (data: UserRegisterSchema) => {
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

  const updateUser = async (data: UserUpdateSchema) => {
    return await Fetch(`/api/users/${data.id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        nama: data.nama,
        email: data.email,
      }),
    });
  };

  const resetPassword = async (data: UserResetPasswordSchema) => {
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
