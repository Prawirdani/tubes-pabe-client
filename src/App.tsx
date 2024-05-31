import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import AuthProvider from './context/AuthProvider';
import { Toaster } from './components/ui/toaster';
import { dashboardRoutes } from './pages/dashboard';
import { publicRoutes } from './pages';
import { H1 } from '@/components/typography';
import { Frown } from 'lucide-react';

export default function App() {
  const router = createBrowserRouter([
    ...publicRoutes,
    ...dashboardRoutes,
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}
function NotFound() {
  return (
    <div className="h-screen">
      <div className="h-full flex flex-col place-items-center">
        <div className="my-auto [&>*]:mx-auto [&>*]:text-primary">
          <Frown size={64} />
          <H1 className="text-primary">Page Not Found!</H1>
        </div>
      </div>
    </div>
  );
}
