import { Card } from '@/components/ui/card';
import { formatIDR } from '@/lib/formatter';

interface Props {
  book: Book;
  onClick?: () => void;
}

export default function BookCard({ book, onClick }: Props) {
  return (
    <Card onClick={onClick} className="hover:bg-gray-200 hover:cursor-pointer shadow-xl">
      <div className="h-[70%] overflow-hidden">
        <img className="rounded-t-lg h-full w-full object-cover" src={`/api/images/${book.image}`} alt="" />
      </div>
      <div className="p-2 xs:p-3 flex flex-col gap-1 h-[30%]">
        <p className="text-sm text-muted-foreground">{book.author.name}</p>
        <h5 className="text-sm sm:text-base font-bold tracking-tight leading-tight line-clamp-1">{book.title}</h5>
        <p className="text-xs xs:text-sm sm:text-sm font-normal text-muted-foreground leading-tight line-clamp-1 lg:line-clamp-2">
          {book.description}
        </p>
        <p className="mt-auto text-end text-xs xs:text-base font-medium">{formatIDR(book.price)}</p>
      </div>
    </Card>
  );
}
