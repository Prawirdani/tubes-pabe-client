import TitleSetter from '@/components/pageTitle';
import { H2 } from '@/components/typography';
import Loader from '@/components/ui/loader';
import { useAuthor } from '@/context/AuthorProvider';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SquarePen, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddAuthorForm from './form-add';
import UpdateAuthorForm from './form-update';
import { useState } from 'react';
import DeleteAuthorDialog from './dialog-delete';

export default function Page() {
  const { loading, authors } = useAuthor();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<Author>({} as Author);

  const triggerUpdateDialog = (author: Author) => {
    setUpdateTarget(author);
    setOpenUpdateDialog(true);
  };

  const triggerDeleteDialog = (author: Author) => {
    setUpdateTarget(author);
    setOpenDeleteDialog(true);
  };

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
        <UpdateAuthorForm open={openUpdateDialog} setOpen={setOpenUpdateDialog} updateTarget={updateTarget} />
        <DeleteAuthorDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} id={updateTarget.id} />
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
                <TableCell>{author.totalBooks}</TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <Button onClick={() => triggerUpdateDialog(author)} variant="outline" className="shadow-md">
                    <SquarePen className="h-4 w-4" />
                  </Button>
                  <Button
                    disabled={author.totalBooks > 0}
                    onClick={() => triggerDeleteDialog(author)}
                    variant="destructive"
                    className="shadow-md"
                  >
                    <Trash className="h-4 w-4" />
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
