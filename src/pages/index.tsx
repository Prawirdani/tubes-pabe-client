import IndexContent from '@/components/layout/Content';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { RouteObject } from 'react-router-dom';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <IndexPage />,
  },
];

function IndexPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <IndexContent />
      <Footer />
    </div>
  );
}
