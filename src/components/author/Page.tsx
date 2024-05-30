import TitleSetter from '@/components/pageTitle';
import { H2 } from '@/components/typography';
import Loader from '@/components/ui/loader';
import { useAuthor } from '@/context/AuthorProvider';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddAuthorForm from './form-add';

export default function Page() {
	const { loading, authors } = useAuthor();
	return loading ? (
		<Loader />
	) : (
		<section>
			<TitleSetter title="Dashboard" />
			<div className="-space-y-1 mb-4">
				<H2>Author</H2>
				<p>Manajemen Author Buku</p>
			</div>

			<div className="mb-4 flex justify-end">
				<AddAuthorForm />
			</div>

			<Card className="p-8">
				<Table>
					<TableHeader>
						<TableRow className="[&>th]:text-medium">
							<TableHead className="text-nowrap">Nama Author</TableHead>
							<TableHead className="w-[60%]">Bio</TableHead>
							<TableHead className="text-nowrap">Jumlah Buku</TableHead>
							<TableHead className="w-[10%]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{authors.map((author) => (
							<TableRow key={author.id}>
								<TableCell className="text-nowrap">{author.name}</TableCell>
								<TableCell>{author.bio}</TableCell>
								<TableCell>{99}</TableCell>
								<TableCell>
									<Button onClick={() => console.log(author)} variant="outline">
										<SquarePen className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</section>
	);
}
