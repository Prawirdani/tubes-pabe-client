import Page from '@/components/user/Page';
import UsersProvider from '@/context/UserProvider';

export default function UserPage() {
  return (
    <UsersProvider>
      <Page />
    </UsersProvider>
  );
}
