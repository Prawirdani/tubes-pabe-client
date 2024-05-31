import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateAuthorSchema, updateAuthorSchema } from '@/lib/schemas/author';
import { isErrorResponse } from '@/lib/fetcher';
import { useAuthors } from '@/context/hooks';

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
	updateTarget: Author;
}

export default function UpdateAuthorForm({ open, setOpen, updateTarget }: Props) {
	const [apiError, setApiError] = useState<string | null>(null);
	const { updateAuthor, invalidate } = useAuthors();

	const form = useForm<UpdateAuthorSchema>({
		resolver: zodResolver(updateAuthorSchema),
	});

	const {
		handleSubmit,
		control,
		reset,
		formState: { isSubmitting },
	} = form;

	useEffect(() => {
		reset({
			name: updateTarget.name,
			bio: updateTarget.bio,
		});
		setApiError(null);
	}, [open, updateTarget]);

	async function onSubmit(data: UpdateAuthorSchema) {
		try {
			const res = await updateAuthor(updateTarget.id, data);

			const resBody = await res.json();
			if (!res.ok) {
				setApiError(isErrorResponse(resBody) ? resBody.error.message : 'Terjadi Kesalahan');
				return;
			}
			toast({ description: 'Berhasil update data author' });
			await invalidate();
			setOpen(false);
		} catch (error) {
			toast({ description: 'Gagal update data author', variant: 'destructive' });
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
								<span>Simpan</span>
								{isSubmitting && <Loader2 className="ml-2 animate-spin" />}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
