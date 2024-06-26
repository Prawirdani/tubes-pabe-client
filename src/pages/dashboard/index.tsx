import BooksPage from './BookPage';
import UserPage from './UserPage';
import AuthorPage from './AuthorPage';
import LoginPage from './LoginPage';
import { Outlet, RouteObject } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/hooks';
import Dashboard from '@/components/layout/dashboard/Dashboard';
import Loader from '@/components/ui/loader';

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { identify } = useAuth();

  useEffect(() => {
    console.log('Persist Login Executed');
    const identifyUser = async () => {
      await identify().finally(() => setIsLoading(false));
    };

    identifyUser();
  }, []);

  return isLoading ? (
    <div className="h-screen">
      <Loader />
    </div>
  ) : (
    <Outlet />
  );
}

export const adminRoutes: RouteObject[] = [
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    element: <PersistLogin />,
    children: [
      {
        path: '/admin',
        element: <Dashboard />,
        children: [
          {
            path: '/admin',
            element: <BooksPage />,
          },
          {
            path: '/admin/users',
            element: <UserPage />,
          },
          {
            path: '/admin/authors',
            element: <AuthorPage />,
          },
        ],
      },
    ],
  },
];
