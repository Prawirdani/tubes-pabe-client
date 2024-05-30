import { z } from 'zod';

export const addAuthorSchema = z.object({
  name: z.string().min(1, { message: 'Isi Nama Author.' }),
  bio: z.string().min(1, { message: 'Isi Biografi Author.' }),
});
export type AddAuthorSchema = z.infer<typeof addAuthorSchema>;

export const updateAuthorSchema = z.object({
  name: z.string().min(1, { message: 'Isi Nama Author.' }),
  bio: z.string().min(1, { message: 'Isi Biografi Author.' }),
});
export type UpdateAuthorSchema = z.infer<typeof updateAuthorSchema>;
