import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddAuthorSchema, addAuthorSchema } from '@/lib/schemas/author';
import { isErrorResponse } from '@/lib/fetcher';
import { useAuthors } from '@/context/hooks';

export default function AddAuthorForm() {
	const [open, setOpen] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const { addAuthor, invalidate } = useAuthors();

	const form = useForm<AddAuthorSchema>({
		resolver: zodResolver(addAuthorSchema),
		defaultValues: {
			name: '',
			bio: '',
		},
	});

	const {
		handleSubmit,
		control,
		reset,
		formState: { isSubmitting },
	} = form;

	async function onSubmit(data: AddAuthorSchema) {
		try {
			const res = await addAuthor(data);

			const resBody = await res.json();
			if (!res.ok) {
				setApiError(isErrorResponse(resBody) ? resBody.error.message : 'Terjadi Kesalahan');
				return;
			}
			toast({ description: 'Berhasil menambahkan buku' });
			await invalidate();
			setOpen(false);
		} catch (error) {
			toast({ description: 'Gagal menambahkan buku', variant: 'destructive' });
		}
	}

	useEffect(() => {
		reset();
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* Dialog Trigger Button */}
			<Button className="space-x-1" onClick={() => setOpen(true)}>
				<Plus />
				<span>Author</span>
			</Button>
			{/* Dialog Trigger Button */}

			<DialogContent className="sm:max-w-[500px] px-8">
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<DialogHeader className="mb-4">
							<DialogTitle>Tambah Author baru</DialogTitle>
						</DialogHeader>
						<div className="space-y-2 col-span-2 mb-4">
							<FormField
								control={control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="name">Nama Author</FormLabel>
										<FormControl>
											<Input id="name" placeholder="Masukkan Nama Author" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="bio">Biografi</FormLabel>
										<FormControl>
											<Textarea id="bio" placeholder="Masukkan biografi Author" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{apiError && <p className="text-destructive text-sm text-end mb-4">Test</p>}
						<div className="flex justify-end">
							<Button type="submit" disabled={isSubmitting}>
								<span>Tambah</span>
								{isSubmitting && <Loader2 className="ml-2 animate-spin" />}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
