import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, BookImage } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddBookSchema, addBookSchema } from '@/lib/schemas/book';
import { useBooks } from '@/context/BookProvider';
import { useAuthor } from '@/context/AuthorProvider';
import Loader from '../ui/loader';

export default function BookAddForm() {
  const { loading, authors } = useAuthor();

  const [open, setOpen] = useState(false);

  const form = useForm<AddBookSchema>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      title: '',
      description: '',
      authorId: '',
      price: 0,
      image: '',
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { isSubmitting, errors },
  } = form;

  const { addBook, invalidate } = useBooks();
  async function onSubmit(data: AddBookSchema) {
    try {
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
      formData.append('image', data.image[0]);

      const res = await addBook(formData);

      if (!res.ok) {
        toast({ description: 'Gagal menambahkan buku', variant: 'destructive' });
        return;
      }

      toast({ description: 'Berhasil menambahkan buku' });
      await invalidate();
      setOpen(false);
    } catch (error) {
      toast({ description: 'Gagal menambahkan buku', variant: 'destructive' });
    }
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
    reset();
    setImagePreview(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Dialog Trigger Button */}
      <Button className="space-x-1" onClick={() => setOpen(true)}>
        <Plus />
        <span>Buku</span>
      </Button>
      {/* Dialog Trigger Button */}

      <DialogContent className="sm:max-w-[850px] px-8">
        {loading ? (
          <Loader />
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader className="mb-4">
                <DialogTitle>Tambah Buku baru</DialogTitle>
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
                    <img src={imagePreview} alt="Preview" className="object-cover" />
                  ) : (
                    <BookImage className="h-12 w-12" />
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
                              <SelectValue placeholder="Pilih Author buku" />
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
              <div className="flex justify-end">
                <Button type="submit">
                  {isSubmitting && <Loader2 />}
                  <span>Tambah</span>
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
