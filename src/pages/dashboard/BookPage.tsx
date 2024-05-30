import Page from '@/components/book/Page';
import AuthorProvider from '@/context/AuthorProvider';
import BooksProvider from '@/context/BookProvider';

export default function BookPage() {
  return (
    <BooksProvider>
      <AuthorProvider>
        <Page />
      </AuthorProvider>
    </BooksProvider>
  );
}
