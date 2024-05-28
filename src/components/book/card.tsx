import { Card } from '@/components/ui/card';
import { formatIDR } from '@/lib/formatter';

interface Props {
  book: Book;
}
export default function BookCard({ book }: Props) {
  return (
    <Card className="max-w-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-200 hover:cursor-pointer">
      <a>
        <img className="rounded-t-lg" src={`/api/images/${book.image}`} alt="" />
      </a>
      <div className="p-5">
        <p className="text-sm text-muted-foreground">{book.author.name}</p>
        <h5 className="mb-2 font-bold tracking-tight leading-tight line-clamp-2">{book.title}</h5>
        <p className="mb-2 text-sm font-normal text-muted-foreground leading-tight line-clamp-2">{book.description}</p>
        <p className="text-end font-medium">{formatIDR(book.price)}</p>
      </div>
    </Card>
  );
}
