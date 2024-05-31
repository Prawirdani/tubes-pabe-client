import { useContext } from 'react';
import { AuthorCtx } from './AuthorProvider';
import { AuthCtx } from './AuthProvider';
import { BookCtx } from './BookProvider';
import { UserCtx } from './UserProvider';

export const useAuthors = () => {
  const ctx = useContext(AuthorCtx);
  if (ctx === undefined) {
    throw new Error('useAuthors must be used within a AuthorProvider');
  }
  return ctx;
};

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return ctx;
};

export const useBooks = () => {
  const ctx = useContext(BookCtx);
  if (ctx === undefined) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return ctx;
};

export const useUsers = () => {
  const ctx = useContext(UserCtx);
  if (ctx === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return ctx;
};
