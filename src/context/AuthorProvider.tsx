import { Fetch } from '@/api/fetcher';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthorContext = {
  loading: boolean;
  authors: Author[];
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

  return (
    <Context.Provider value={{ loading, authors }}>
      <>{children}</>
    </Context.Provider>
  );
}
