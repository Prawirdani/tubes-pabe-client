import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { Toaster } from './components/ui/toaster';
import { adminRoutes } from './pages/dashboard';
import { publicRoutes } from './pages';
import { H1 } from '@/components/typography';
import { Frown } from 'lucide-react';
import BookProvider from './context/BookProvider';
import AuthorProvider from './context/AuthorProvider';

export default function App() {
  const router = createBrowserRouter([
    ...publicRoutes,
    ...adminRoutes,
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  return (
    <BookProvider>
      <AuthorProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthorProvider>
    </BookProvider>
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
