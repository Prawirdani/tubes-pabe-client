import TitleSetter from '@/components/pageTitle';
import { H2 } from '@/components/typography';
import Loader from '@/components/ui/loader';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { KeyRound, SquarePen, Trash } from 'lucide-react';
import { useUsers } from '@/context/UserProvider';
import { titleCase } from '@/lib/utils';
import { ResetPasswordForm } from './form-reset-password';
import { RegisterUserForm } from './form-register';
import { UserUpdateForm } from './form-update';
import DeleteUserDialog from './dialog-delete';

export default function Page() {
	const { loading, users } = useUsers();
	const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
	const [openResetPass, setOpenResetPass] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [updateTarget, setUpdateTarget] = useState<User>({} as User);

	const triggerUpdateForm = (m: User) => {
		setUpdateTarget(m);
		setOpenUpdateDialog(true);
	};

	const triggerResetPassForm = (m: User) => {
		setUpdateTarget(m);
		setOpenResetPass(true);
	};

	const triggerDeleteDialog = (m: User) => {
		setUpdateTarget(m);
		setOpenDeleteDialog(true);
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
				<RegisterUserForm />
				<UserUpdateForm open={openUpdateDialog} setOpen={setOpenUpdateDialog} updateTarget={updateTarget} />
				<ResetPasswordForm open={openResetPass} setOpen={setOpenResetPass} updateTarget={updateTarget} />
				<DeleteUserDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} id={updateTarget.id} />
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
								<TableCell className="flex justify-center gap-3">
									<Button className="shadow-md" onClick={() => triggerUpdateForm(u)} variant="outline">
										<SquarePen className="h-4 w-4" />
									</Button>
									<Button className="shadow-md" onClick={() => triggerResetPassForm(u)} variant="outline">
										<KeyRound className="h-4 w-4" />
									</Button>
									<Button className="shadow-md" onClick={() => triggerDeleteDialog(u)} variant="destructive">
										<Trash className="h-4 w-4" />
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
