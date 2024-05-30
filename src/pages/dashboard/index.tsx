import BooksPage from './BookPage';
import UserPage from './UserPage';
import AuthorPage from './AuthorPage';
import LoginPage from './LoginPage';
import { Outlet, RouteObject } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Loader } from 'lucide-react';
import Dashboard from '@/layout/Dashboard';

function PersistLogin() {
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
}

export const dashboardRoutes: RouteObject[] = [
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
	{
		path: '/admin/login',
		element: <LoginPage />,
	},
];
