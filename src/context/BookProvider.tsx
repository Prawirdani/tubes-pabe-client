import { Fetch } from '@/api/fetcher';
import { createContext, useContext, useEffect, useState } from 'react';

type Context = {
  loading: boolean;
  books: Book[];
  search: (query: string) => Promise<void>;
  invalidate: () => Promise<void>;
  addBook: (formData: FormData) => Promise<Response>;
  updateBook: (id: number, formData: FormData) => Promise<Response>;
  deleteBook: (id: number) => Promise<Response>;
};
export const BooksContext = createContext<Context>({} as Context);
export const useBooks = () => useContext(BooksContext);

export default function BooksProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  async function fetchBooks() {
    const response = await Fetch('/api/books', {
      credentials: 'include',
    });
    const resBody = (await response.json()) as ApiResponse<Book[]>;
    return resBody.data;
  }

  async function addBook(formData: FormData) {
    return Fetch('/api/books', {
      credentials: 'include',
      method: 'POST',
      body: formData,
    });
  }

  async function updateBook(id: number, formData: FormData) {
    return Fetch(`/api/books/${id}`, {
      credentials: 'include',
      method: 'PUT',
      body: formData,
    });
  }

  async function deleteBook(id: number) {
    return Fetch(`/api/books/${id}`, {
      credentials: 'include',
      method: 'DELETE',
    });
  }

  async function search(query: string) {
    if (!query || query === '') {
      await invalidate();
      return;
    }
    const response = await Fetch(`/api/books?search=${query}`, {
      credentials: 'include',
    });
    const resBody = (await response.json()) as ApiResponse<Book[]>;
    setBooks(resBody.data);
  }

  async function invalidate() {
    const data = await fetchBooks();
    setBooks(data);
  }

  return (
    <BooksContext.Provider value={{ loading, books, invalidate, search, addBook, updateBook, deleteBook }}>
      <>{children}</>
    </BooksContext.Provider>
  );
}
