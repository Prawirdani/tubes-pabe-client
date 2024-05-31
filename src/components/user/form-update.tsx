import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { UserUpdateSchema, userUpdateSchema } from '@/lib/schemas/user';
import { isErrorResponse } from '@/api/fetcher';
import { useUsers } from '@/context/hooks';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  updateTarget: User;
}
export const UserUpdateForm = ({ open, setOpen, updateTarget }: Props) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const { invalidate, updateUser } = useUsers();

  const form = useForm<UserUpdateSchema>({
    resolver: zodResolver(userUpdateSchema),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    reset({
      ...updateTarget,
    });
    setApiError(null);
  }, [open, updateTarget]);

  const onSubmit = async (data: UserUpdateSchema) => {
    const res = await updateUser(updateTarget.id, data);
    if (!res.ok) {
      const resBody = await res.json();
      setApiError(isErrorResponse(resBody) ? resBody.error.message : 'Terjadi Kesalahan');
      return;
    }
    invalidate();
    toast({
      description: 'Berhasil update akun pengguna.',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="mb-4">
              <DialogTitle>Update data pengguna</DialogTitle>
            </DialogHeader>
            <div className="mb-4 space-y-2">
              {/* Input Nama */}
              <FormField
                control={control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="nama">Nama</FormLabel>
                    <FormControl>
                      <Input id="nama" placeholder="Masukkan nama pengguna" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Input Nama */}

              {/* Input Email */}
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Ulangi password</FormLabel>
                    <FormControl>
                      <Input id="email" placeholder="Masukkan email pengguna" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Input Email */}

              <p className="text-sm text-destructive">{apiError}</p>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                <span>Simpan</span>
                {isSubmitting && <Loader2 className="animate-spin ml-2" />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
