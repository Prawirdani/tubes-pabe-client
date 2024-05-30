import Page from '@/components/author/Page';
import AuthorProvider from '@/context/AuthorProvider';

export default function AuthorPage() {
  return (
    <AuthorProvider>
      <Page />
    </AuthorProvider>
  );
}
