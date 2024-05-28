import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { UpdateSchema, updateSchema, useUsers } from '@/context/UserProvider';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  updateTarget: User;
}
export const UserUpdateForm = ({ open, setOpen, updateTarget }: Props) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const { invalidate, updateUser } = useUsers();

  const form = useForm<UpdateSchema>({
    resolver: zodResolver(updateSchema),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    reset({
      id: updateTarget.id,
      nama: updateTarget.nama,
      email: updateTarget.email,
    });
    setApiError(null);
  }, [open, updateTarget]);

  const onSubmit = async (data: UpdateSchema) => {
    const res = await updateUser(data);
    if (!res.ok) {
      const resBody = (await res.json()) as ErrorResponse;
      setApiError(resBody.error.message);
      return;
    }
    invalidate();
    reset();
    toast({
      description: 'Berhasil update akun pengguna.',
    });
    setOpen(false);
    setApiError(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="mb-4">
              <DialogTitle>Update Data Pengguna</DialogTitle>
            </DialogHeader>
            <div className="mb-4 space-y-2">
              {/* Input Nama Pengguna */}
              <FormField
                control={control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="nama">Nama Pengguna</FormLabel>
                    <FormControl>
                      <Input id="nama" placeholder="Masukkan nama pengguna" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Input Nama Pengguna */}

              {/* Input Username  */}
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl>
                      <Input id="username" placeholder="Masukkan email pengguna" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Input Username  */}
              <p className="text-sm text-destructive">{apiError}</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                {isSubmitting && <Loader2 />}
                <span>Simpan</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
