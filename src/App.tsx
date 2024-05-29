import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Dashboard from './layout/Dashboard';
import LoginPage from './pages/LoginPage';
import AuthProvider from './context/AuthProvider';
import { useEffect, useState } from 'react';
import Loader from '@/components/ui/loader';
import { useAuth } from './context/useAuth';
import { BooksPage, UserPage } from './pages/dashboard';
import { Toaster } from './components/ui/toaster';
import AuthorPage from './pages/dashboard/AuthorPage';

export default function App() {
  const router = createBrowserRouter([
    {
      element: <PersistLogin />,
      children: [
        {
          path: '/',
          element: <Dashboard />,
          children: [
            {
              path: '/',
              element: <BooksPage />,
            },
            {
              path: '/users',
              element: <UserPage />,
            },
            {
              path: '/authors',
              element: <AuthorPage />,
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { identify } = useAuth();

  useEffect(() => {
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
};
