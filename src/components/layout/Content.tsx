import { useBooks } from '@/context/hooks';
import { Card } from '../ui/card';
import { formatIDR } from '@/lib/formatter';
import { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '../ui/input';
import TitleSetter from '../pageTitle';
import { debounce } from '@/lib/debouncer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { buttonVariants } from '../ui/button';
import banner from '../../assets/banner.png';

export default function IndexContent() {
  const { books, search } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [bookTarget, setBookTarget] = useState({} as Book);

  const debounceSearch = debounce(searchQuery, 1000);
  useEffect(() => {
    const performSearch = async () => {
      setSearchLoading(true);
      await search(debounceSearch);
      setSearchLoading(false);
    };
    performSearch();
  }, [debounceSearch]);

  const triggerDialogOpen = (book: Book) => {
    setBookTarget(book);
    setOpen(true);
  };

  return (
    <section className="flex-grow py-12 px-4 sm:px-12 2xl:px-96 bg-primary-foreground">
      <TitleSetter title="LoremBookStore" />
      <div className="h-full">
        <Banner />
      </div>

      <div className="mt-12 flex justify-end items-center gap-2">
        {searchLoading && <Loader2 className="animate-spin text-primary" />}
        <div className="relative w-4/5 md:w-2/5">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
          <Input
            name="search"
            id="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Judul atau Author buku"
            className="shadow-md border-primary"
          />
        </div>
      </div>

      {books.length === 0 && (
        <p>
          0 Hasil untuk pencarian <b>{debounceSearch}</b>
        </p>
      )}
      <BookDialog open={open} setOpen={setOpen} book={bookTarget} />
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-center">
        {books.map((book) => (
          <BookCard onClick={() => triggerDialogOpen(book)} key={book.id} book={book} />
        ))}
        {books.map((book) => (
          <BookCard onClick={() => triggerDialogOpen(book)} key={book.id} book={book} />
        ))}
        {books.map((book) => (
          <BookCard onClick={() => triggerDialogOpen(book)} key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}

function Banner() {
  return (
    <Card className="border-none h-42 md:h-80 shadow-2xl overflow-hidden">
      <img src={banner} className="w-full h-full object-cover" />
    </Card>
  );
}

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

function BookCard({ book, onClick }: BookCardProps) {
  return (
    <Card onClick={onClick} className="hover:bg-gray-200 hover:cursor-pointer shadow-xl">
      <div className="h-[70%] overflow-hidden">
        <img className="rounded-t-lg h-full w-full object-cover" src={`/api/images/${book.image}`} alt="" />
      </div>
      <div className="p-2 xs:p-3 flex flex-col gap-1 h-[30%]">
        <p className="text-sm text-muted-foreground">{book.author.name}</p>
        <h5 className="text-sm sm:text-base font-bold tracking-tight leading-tight line-clamp-1">{book.title}</h5>
        <p className="text-xs xs:text-sm sm:text-sm font-normal text-muted-foreground leading-tight line-clamp-2">
          {book.description}
        </p>
        <p className="mt-auto text-end text-xs xs:text-base font-medium">{formatIDR(book.price)}</p>
      </div>
    </Card>
  );
}

interface BookDialogProps {
  book: Book;
  open: boolean;
  setOpen: (v: boolean) => void;
}
function BookDialog({ book, open, setOpen }: BookDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90%] lg:max-w-[70%] 2xl:max-w-[60%] rounded-lg">
        <DialogHeader className="mb-4">
          <DialogTitle>{book.title}</DialogTitle>
        </DialogHeader>
        <div className="px-3 pb-3">
          <div className="grid sm:grid-cols-3 gap-8 ">
            <div className="h-48 xl:h-96 mx-auto w-auto sm:col-span-1">
              <img src={`/api/images/${book.image}`} className="object-cover h-full" alt="Book Cover" />
            </div>
            <div className="sm:col-span-2 flex flex-col">
              <p className="font-medium text-sm leading-none text-muted-foreground">Author</p>
              <h2 className="font-medium mb-6">{book.author?.name}</h2>

              <div className="flex-grow">
                <p className="font-medium text-sm leading-none text-muted-foreground">Deskripsi Buku</p>
                <p className="text-justify tracking-tight text-sm md:text-base">{book.description}</p>
              </div>
              <div className="flex justify-end mt-4 sm:mt-0">
                <a
                  href={`https://api.whatsapp.com/send?phone=6288806892767&text=Halo, Saya ingin membeli buku *${book.title}-${book.author?.name}*`}
                  target="_blank"
                  className={`w-fit ${buttonVariants({ variant: 'default' })}`}
                >
                  Beli buku ini
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
