import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import AuthorProvider from '@/context/AuthorProvider';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <AuthorProvider>
      <div className="flex min-h-screen overflow-hidden">
        {/* Sidebar component */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Sidebar component */}

        <div className="flex-1 flex flex-col relative overflow-x-hidden pl-0 lg:pl-72 pt-14 lg:pt-16">
          {/* Header component */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* Header component */}
          {/* Main content */}
          <main className="bg-secondary flex-1 p-8 w-full overflow-y-auto">
            <Outlet />
          </main>
          {/* Main content */}
        </div>
      </div>
    </AuthorProvider>
  ) : (
    <Navigate to="/login" replace />
  );
}
