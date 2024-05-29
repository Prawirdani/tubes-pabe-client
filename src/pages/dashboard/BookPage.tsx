import AddBookForm from '@/components/book/add-form';
import BookCard from '@/components/book/card';
import TitleSetter from '@/components/pageTitle';
import { H2 } from '@/components/typography';
import Loader from '@/components/ui/loader';
import BooksProvider, { useBooks } from '@/context/BookProvider';
import { useEffect } from 'react';

export default function BookPage() {
  return (
    <BooksProvider>
      <Page />
    </BooksProvider>
  );
}

function Page() {
  const { loading, books } = useBooks();
  useEffect(() => {
    console.log(books);
  }, [books]);
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
        <AddBookForm />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8 justify-center">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
