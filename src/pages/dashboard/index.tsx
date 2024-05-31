import BooksPage from './BookPage';
import UserPage from './UserPage';
import AuthorPage from './AuthorPage';
import LoginPage from './LoginPage';
import { Outlet, RouteObject } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from '@/context/hooks';
import Dashboard from '@/components/layout/dashboard/Dashboard';
import AuthProvider from '@/context/AuthProvider';

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

export const dashboardRoutes: RouteObject[] = [
  {
    element: (
      <AuthProvider>
        <PersistLogin />
      </AuthProvider>
    ),
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
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
];
