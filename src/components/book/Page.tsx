import BookCard from '@/components/book/card';
import TitleSetter from '@/components/pageTitle';
import { H2 } from '@/components/typography';
import Loader from '@/components/ui/loader';
import { useBooks } from '@/context/BookProvider';
import BookAddForm from './form-add';

export default function Page() {
  const { loading, books } = useBooks();
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
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8 justify-center">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
