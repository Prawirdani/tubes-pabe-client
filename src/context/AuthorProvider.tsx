import { Fetch } from '@/api/fetcher';
import { AddAuthorSchema, UpdateAuthorSchema } from '@/lib/schemas/author';
import { createContext, useEffect, useState } from 'react';

type AuthorContextType = {
  loading: boolean;
  authors: Author[];
  addAuthor: (data: AddAuthorSchema) => Promise<Response>;
  updateAuthor: (id: number, data: UpdateAuthorSchema) => Promise<Response>;
  deleteAuthor: (id: number) => Promise<Response>;
  invalidate: () => Promise<void>;
};

export const AuthorCtx = createContext<AuthorContextType | undefined>(undefined);

export default function AuthorProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    fetchAuthors().then((data) => {
      setAuthors(data);
      setLoading(false);
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

  async function updateAuthor(id: number, data: UpdateAuthorSchema) {
    return Fetch(`/api/authors/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data }),
    });
  }

  async function deleteAuthor(id: number) {
    return Fetch(`/api/authors/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }

  async function invalidate() {
    const data = await fetchAuthors();
    setAuthors(data);
  }

  return (
    <AuthorCtx.Provider value={{ loading, authors, invalidate, addAuthor, updateAuthor, deleteAuthor }}>
      <>{children}</>
    </AuthorCtx.Provider>
  );
}
