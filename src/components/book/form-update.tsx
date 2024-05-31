import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateBookSchema, updateBookSchema } from '@/lib/schemas/book';
import Loader from '../ui/loader';
import { useAuthors, useBooks } from '@/context/hooks';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  updateTarget: Book;
}

export default function BookUpdateForm({ open, setOpen, updateTarget }: Props) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { loading, authors } = useAuthors();
  const { updateBook, invalidate, deleteBook } = useBooks();

  const form = useForm<UpdateBookSchema>({
    resolver: zodResolver(updateBookSchema),
  });

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { isSubmitting, errors },
  } = form;

  async function onSubmit(data: UpdateBookSchema) {
    const formData = new FormData();
    formData.append(
      'data',
      JSON.stringify({
        title: data.title,
        description: data.description,
        authorId: Number(data.authorId),
        price: Number(data.price),
      }),
    );
    if (data.image) {
      formData.append('image', data.image[0]);
    }

    const res = await updateBook(updateTarget.id, formData);
    if (!res.ok) {
      toast({ description: 'Gagal updata data buku', variant: 'destructive' });
      return;
    }

    toast({ description: 'Berhasil updata data buku' });
    await invalidate();
    setOpen(false);
  }

  async function handleDelete() {
    setDeleteLoading(true);
    const res = await deleteBook(updateTarget.id);
    if (!res.ok) {
      toast({ description: 'Gagal menghapus data buku', variant: 'destructive' });
      setDeleteLoading(false);
      return;
    }

    toast({ description: 'Berhasil menghapus data buku' });
    await invalidate();
    setOpen(false);
  }

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  let imageInputRef: HTMLInputElement;
  const { ref, ...imageRegister } = register('image');

  const handleImageClick = () => {
    imageInputRef.click();
  };

  const imageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    form.setValue('image', e.target.files);
    if (files && files[0]) {
      const imageUrl = URL.createObjectURL(files[0]);
      setImagePreview(imageUrl);
    }
  };

  useEffect(() => {
    reset({
      title: updateTarget.title ?? '',
      description: updateTarget.description ?? '',
      authorId: String(updateTarget.author?.id) ?? '',
      price: updateTarget.price ?? 0,
    });
    setImagePreview(null);
    setDeleteLoading(false);
  }, [open, updateTarget]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[850px] px-8">
        {loading ? (
          <Loader />
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader className="mb-4">
                <DialogTitle>Update data Buku</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-8 mb-4">
                <input
                  type="file"
                  id="image"
                  hidden
                  {...imageRegister}
                  ref={(e) => {
                    imageInputRef = e!;
                  }}
                  onChange={imageOnChange}
                />
                <div
                  className="col-span-1 border rounded-md justify-center items-center flex flex-col hover:cursor-pointer"
                  onClick={handleImageClick}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <img
                      src={`/api/images/${updateTarget.image}`}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  )}
                  {errors.image && (
                    <span className="mt-2 text-sm text-destructive text-center">{String(errors.image.message)}</span>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="title">Judul Buku</FormLabel>
                        <FormControl>
                          <Input id="title" placeholder="Masukkan Judul Buku" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="price">Harga</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan harga buku"
                            id="price"
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="authorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="authorId">Kategori Menu</FormLabel>
                        <Select onValueChange={field.onChange} name={field.name}>
                          <FormControl id="authorId">
                            <SelectTrigger>
                              <SelectValue placeholder={updateTarget.author.name} defaultValue={field.value} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {authors.map((author) => (
                              <SelectItem key={author.id} value={String(author.id)}>
                                {author.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormField
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="description">Deskripsi</FormLabel>
                          <FormControl>
                            <Textarea id="description" placeholder="Masukkan deskripsi buku" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" onClick={handleDelete} variant="destructive" disabled={deleteLoading}>
                  <span>Hapus Buku</span>
                  {deleteLoading && <Loader2 className="animate-spin ml-2" />}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <span>Simpan</span>
                  {isSubmitting && <Loader2 className="animate-spin ml-2" />}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
