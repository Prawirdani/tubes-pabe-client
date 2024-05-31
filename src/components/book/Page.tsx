import BookCard from '@/components/book/card';
import TitleSetter from '@/components/pageTitle';
import { H2 } from '@/components/typography';
import Loader from '@/components/ui/loader';
import BookAddForm from './form-add';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import BookUpdateForm from './form-update';
import { useBooks } from '@/context/hooks';

export default function Page() {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<Book>({} as Book);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      const performSearch = async () => {
        setSearchLoading(true);
        try {
          await search(searchQuery);
        } finally {
          setSearchLoading(false);
        }
      };

      performSearch();
    }, 500);

    return () => clearTimeout(delayInputTimeoutId);
  }, [searchQuery]);

  const { loading, books, search } = useBooks();

  const triggerUpdateDialog = (book: Book) => {
    setUpdateTarget(book);
    setOpenUpdateDialog(true);
  };

  return loading ? (
    <Loader />
  ) : (
    <section>
      <TitleSetter title="Dashboard" />
      <div className="-space-y-1 mb-4">
        <H2>Buku</H2>
        <p>Manajemen buku</p>
      </div>
      <div className="flex justify-end mb-4">
        <BookAddForm />
        <BookUpdateForm open={openUpdateDialog} setOpen={setOpenUpdateDialog} updateTarget={updateTarget} />
      </div>

      <Card className="p-8 flex flex-col gap-8">
        <div className="space-y-1">
          <Label htmlFor="search">Cari Buku</Label>
          <div className="flex w-3/4 sm:w-2/4 xl:w-1/4 items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
              <Input
                name="search"
                id="search"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik Judul atau Author buku"
                className="pl-10 shadow-md border-primary"
              />
            </div>
            {searchLoading && <Loader2 className="animate-spin text-primary" />}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 justify-center">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => triggerUpdateDialog(book)} />
          ))}
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => triggerUpdateDialog(book)} />
          ))}
        </div>
      </Card>
    </section>
  );
}
