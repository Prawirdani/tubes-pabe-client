import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { isErrorResponse } from '@/lib/fetcher';
import { UserRegisterSchema, userRegisterSchema } from '@/lib/schemas/user';
import { useUsers } from '@/context/hooks';

export const RegisterUserForm = () => {
	const [open, setOpen] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const { invalidate, registerUser } = useUsers();
	const form = useForm<UserRegisterSchema>({
		resolver: zodResolver(userRegisterSchema),
		defaultValues: {
			nama: '',
			email: '',
			password: '',
			repeatPassword: '',
		},
	});

	const {
		handleSubmit,
		control,
		reset,
		formState: { isSubmitting },
	} = form;

	useEffect(() => {
		reset();
		setApiError(null);
	}, [open]);

	const onSubmit = async (data: UserRegisterSchema) => {
		const res = await registerUser(data);
		if (!res.ok) {
			const resBody = await res.json();
			setApiError(isErrorResponse(resBody) ? resBody.error.message : 'Terjadi Kesalahan');
			return;
		}
		invalidate();
		reset();
		toast({ description: 'Berhasil menambahkan pengguna.' });
		setOpen(false);
		setApiError(null);
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* Dialog Trigger Button */}
			<Button className="space-x-1" onClick={() => setOpen(true)}>
				<Plus />
				<span>Akun Pengguna</span>
			</Button>
			{/* Dialog Trigger Button */}

			<DialogContent className="sm:max-w-[525px]">
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
						<DialogHeader className="mb-4">
							<DialogTitle>Register Akun Pengguna</DialogTitle>
						</DialogHeader>
						<div className="mb-4 space-y-2">
							<FormField
								control={control}
								name="nama"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="nama">Nama Pengguna</FormLabel>
										<FormControl>
											<Input autoComplete="off" id="nama" placeholder="Masukkan nama pengguna" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="email">Email</FormLabel>
										<FormControl>
											<Input autoComplete="user-off" id="email" placeholder="Masukkan email pengguna" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="password">Password</FormLabel>
										<FormControl>
											<Input
												autoComplete="pass-off"
												id="password"
												type="password"
												placeholder="Masukkan password pengguna"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="repeatPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="repeatPassword">Ulangi Password</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												id="repeatPassword"
												type="password"
												placeholder="Ulangi password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<p className="text-sm text-destructive">{apiError}</p>
						</div>
						<div className="flex justify-end">
							<Button type="submit">
								{isSubmitting && <Loader2 />}
								<span>Simpan</span>
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
