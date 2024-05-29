import { Fetch } from '@/api/fetcher';
import { AddAuthorSchema } from '@/lib/schemas/author';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthorContext = {
  loading: boolean;
  authors: Author[];
  addAuthor: (data: AddAuthorSchema) => Promise<Response>;
  invalidate: () => Promise<void>;
};

const Context = createContext<AuthorContext>({} as AuthorContext);
export const useAuthor = () => useContext(Context);

export default function AuthorProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<Author[]>([]);
  useEffect(() => {
    fetchAuthors().then((data) => {
      setLoading(false);
      setAuthors(data!);
    });
  }, []);

  async function fetchAuthors() {
    const response = await Fetch('/api/authors');
    const resBody = (await response.json()) as ApiResponse<Author[]>;
    return resBody.data;
  }

  async function addAuthor(data: AddAuthorSchema) {
    return Fetch('/api/authors', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data }),
    });
  }

  async function invalidate() {
    setLoading(true);
    const data = await fetchAuthors();
    setAuthors(data!);
    setLoading(false);
  }

  return (
    <Context.Provider value={{ loading, authors, addAuthor, invalidate }}>
      <>{children}</>
    </Context.Provider>
  );
}
