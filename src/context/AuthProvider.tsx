import { Fetch } from '@/api/fetcher';
import { createContext, useContext, useState } from 'react';

type AuthCtxType = {
  user: AuthUser;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Response>;
  identify: () => Promise<void>;
  logout: () => Promise<void>;
};

type Props = {
  children: React.ReactNode;
};

const AuthCtx = createContext<AuthCtxType>({} as AuthCtxType);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser>({} as AuthUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    return res;
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'DELETE',
      credentials: 'include',
    });
    setIsAuthenticated(false);
    setUser({} as AuthUser);
  };

  const identify = async () => {
    const res = await Fetch('/api/auth/current', {
      method: 'GET',
      credentials: 'include',
    });
    if (res.ok) {
      const resBody = (await res.json()) as { data: AuthUser };
      setIsAuthenticated(true);
      setUser(resBody.data);
    }
  };

  return (
    <AuthCtx.Provider value={{ user, isAuthenticated, login, identify, logout }}>
      <>{children}</>
    </AuthCtx.Provider>
  );
}
