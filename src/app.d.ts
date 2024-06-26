// app.d.ts
declare global {
  type ApiResponse<T> = {
    data: T;
    message?: string;
  };

  type ErrorResponse = {
    error: {
      status: number;
      message: string;
      details?: Record<string, string>;
    };
  };

  type UserRole = 'admin' | 'operator';
  type User = {
    id: number;
    nama: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  };

  type AuthUser = {
    id: number;
    nama: string;
    email: string;
    role: UserRole;
  };

  type Author = {
    id: number;
    name: string;
    bio: string;
    totalBooks: number;
  };

  type Book = {
    id: number;
    title: string;
    description: string;
    author: Author;
    price: number;
    image: string;
    createdAt: Date;
    updateAt: Date;
  };

  type Author = {
    id: number;
    name: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export {};
