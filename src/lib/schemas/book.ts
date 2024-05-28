import { z } from 'zod';

export const addBookSchema = z.object({
  title: z.string().min(1, { message: 'Isi judul buku.' }),
  description: z.string().min(1, { message: 'Isi deskripsi buku.' }),
  authorId: z.string().min(1, { message: 'Isi nama penulis buku.' }),
  price: z.number().min(1, { message: 'Isi harga buku.' }),
  image: z
    .any()
    // To not allow empty files
    .refine((files) => files?.length >= 1, { message: 'Upload cover buku.' }),
});
export type AddBookSchema = z.infer<typeof addBookSchema>;
