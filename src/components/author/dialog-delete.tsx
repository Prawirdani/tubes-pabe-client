import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { isErrorResponse } from '@/lib/fetcher';
import { Loader2 } from 'lucide-react';
import { useAuthors } from '@/context/hooks';

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
	id: number;
}

export default function DeleteAuthorDialog({ open, setOpen, id }: Props) {
	const [apiError, setApiError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { deleteAuthor, invalidate } = useAuthors();

	useEffect(() => {
		setApiError(null);
		setLoading(false);
	}, [open]);

	const handleDelete = async () => {
		setLoading(true);
		const res = await deleteAuthor(id);
		if (!res.ok) {
			const resBody = await res.json();
			setApiError(isErrorResponse(resBody) ? resBody.error.message : 'Terjadi kesalahan');
			return;
		}
		await invalidate();
		toast({ description: 'Berhasil menghapus data author.' });
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader className="mb-4">
					<DialogTitle>Hapus Author</DialogTitle>
				</DialogHeader>
				<p>Apakah Anda yakin ingin menghapus data author ini?</p>
				<p className="text-sm text-destructive">{apiError}</p>
				<div className="flex justify-end [&>button]:w-24 gap-2">
					<Button type="button" variant="secondary" onClick={() => setOpen(false)}>
						<span>Batal</span>
					</Button>
					<Button disabled={loading} type="button" onClick={handleDelete}>
						{loading && <Loader2 className="animate-spin" />}
						<span>Ya</span>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
