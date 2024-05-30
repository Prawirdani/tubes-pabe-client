import { Fetch, FetchToast } from '@/api/fetcher';
import { UserRegisterSchema, UserResetPasswordSchema, UserUpdateSchema } from '@/lib/schemas/user';
import { createContext, useContext, useEffect, useState } from 'react';

type Context = {
  // Fetch State
  loading: boolean;
  // Data State
  users: User[];
  // Invalidate users Data
  invalidate: () => Promise<void>;
  registerUser: (data: UserRegisterSchema) => Promise<Response>;
  updateUser: (id: number, data: UserUpdateSchema) => Promise<Response>;
  resetPassword: (id: number, data: UserResetPasswordSchema) => Promise<Response>;
  deleteUser: (id: number) => Promise<Response>;
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

  async function fetchUsers() {
    const response = await Fetch('/api/users', {
      credentials: 'include',
    });
    const resBody = (await response.json()) as ApiResponse<User[]>;
    return resBody.data;
  }

  async function registerUser(data: UserRegisterSchema) {
    return await Fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...data,
      }),
    });
  }

  async function updateUser(id: number, data: UserUpdateSchema) {
    return await Fetch(`/api/users/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    });
  }

  async function resetPassword(id: number, data: UserResetPasswordSchema) {
    return await Fetch(`/api/users/${id}/reset-password`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    });
  }

  async function deleteUser(id: number) {
    return await Fetch(`/api/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }

  return (
    <UsersContext.Provider
      value={{
        loading,
        users,
        invalidate,
        registerUser,
        updateUser,
        resetPassword,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
