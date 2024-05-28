import { Fetch } from '@/api/fetcher';
import { createContext, useContext, useEffect, useState } from 'react';

type Context = {
  loading: boolean;
  books: Book[];

  addBook: (formData: FormData) => Promise<Response>;
  invalidate: () => Promise<void>;
};
export const BooksContext = createContext<Context>({} as Context);
export const useBooks = () => useContext(BooksContext);

export default function BooksProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks().then((data) => {
      setBooks(data!);
      setLoading(false);
    });
  }, []);

  async function fetchBooks() {
    const response = await Fetch('/api/books');
    const resBody = (await response.json()) as ApiResponse<Book[]>;
    return resBody.data;
  }

  async function addBook(formData: FormData) {
    return Fetch('/api/books', {
      method: 'POST',
      body: formData,
    });
  }

  async function invalidate() {
    setLoading(true);
    const data = await fetchBooks();
    setBooks(data!);
    setLoading(false);
  }

  return (
    <BooksContext.Provider value={{ loading, books, addBook, invalidate }}>
      <>{children}</>
    </BooksContext.Provider>
  );
}
