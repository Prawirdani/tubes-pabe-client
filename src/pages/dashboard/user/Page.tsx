import TitleSetter from '@/components/pageTitle';
import { H2 } from '@/components/typography';
import Loader from '@/components/ui/loader';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { KeyRound, SquarePen } from 'lucide-react';
import { useUsers } from '@/context/UserProvider';
import { RegisterForm } from './RegisterForm';
import { UserUpdateForm } from './UpdateForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { titleCase } from '@/lib/utils';

export default function Page() {
  const { loading, users } = useUsers();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openResetPass, setOpenResetPass] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<User>({} as User);

  const triggerUpdateForm = (m: User) => {
    setUpdateTarget(m);
    setOpenUpdateDialog(true);
  };

  const triggerResetPassForm = (m: User) => {
    setUpdateTarget(m);
    setOpenResetPass(true);
  };

  return loading ? (
    <Loader />
  ) : (
    <section>
      <TitleSetter title="Pengguna" />
      <div className="-space-y-1 mb-4">
        <H2>Pengguna</H2>
        <p>Manajemen akun pengguna</p>
      </div>

      <div className="flex justify-end mb-4">
        <RegisterForm />
        <UserUpdateForm open={openUpdateDialog} setOpen={setOpenUpdateDialog} updateTarget={updateTarget} />
        <ResetPasswordForm open={openResetPass} setOpen={setOpenResetPass} updateTarget={updateTarget} />
      </div>
      <Card className="p-8">
        <Table>
          <TableHeader>
            <TableRow className="[&>th]:text-medium">
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[10%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.nama}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{titleCase(u.role)}</TableCell>
                <TableCell className="flex justify-center gap-4">
                  <Button onClick={() => triggerUpdateForm(u)} variant="outline">
                    <SquarePen className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => triggerResetPassForm(u)} variant="outline">
                    <KeyRound className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
}
