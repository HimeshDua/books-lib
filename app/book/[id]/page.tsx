import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import {BookOpen} from 'lucide-react';
import type {Book} from '@/types';
import {createClient} from '@/lib/supabase/server';
import ToggleFavoriteBook, {
  ToggleFavoriteBookSkeleton,
} from '@/components/favoritism/toggleFavoriteBook';
import {Suspense} from 'react';
import {getUserById} from '@/lib/getUserId';
import {getBookfromId} from '@/lib/getBookfromId';
import AuthDialog from '@/components/auth-dialog';

export default async function DetailedBook({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const supabase = await createClient();

  const {data, error} = await getBookfromId(supabase, id);
  const {userId} = await getUserById(supabase);

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-background text-foreground">
        <h2 className="text-xl font-bold mb-2 text-red-500">Book not found</h2>
        <p className="text-sm text-muted-foreground">
          {error ? error.message : `No book found related to ID: ${id}`}
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/">← Back to Library</Link>
          </Button>
        </div>
      </div>
    );
  }

  const book: Book = data;
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="w-full">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-muted">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No Cover Available
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              {book.title}
            </h1>
            <p className="text-base text-muted-foreground mb-2">
              by{' '}
              <span className="font-semibold text-foreground">
                {book.author || 'Unknown Author'}
              </span>
            </p>

            {book.languages && book.languages.length > 0 && (
              <p className="text-sm text-muted-foreground mb-4">
                Language:{' '}
                <span className="font-medium text-foreground">{book.languages.join(', ')}</span>
              </p>
            )}

            {book.description && (
              <>
                <Separator className="my-4" />
                <p className="text-sm leading-relaxed text-muted-foreground">{book.description}</p>
              </>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {book.download_links?.pdf && (
                <Button asChild>
                  <Link href={`/read/${book.id}`} target="_blank">
                    <BookOpen className="w-4 h-4 mr-2" /> Read Online
                  </Link>
                </Button>
              )}
              {book.download_links?.epub &&
                (userId ? (
                  <Button asChild variant="outline">
                    <Link href={book.download_links.epub} target="_blank">
                      📚 Download ePub
                    </Link>
                  </Button>
                ) : (
                  <AuthDialog
                    description="download books"
                    dialogTrigger={<Button variant="outline">📚 Download ePub</Button>}
                  />
                ))}

              <Suspense fallback={<ToggleFavoriteBookSkeleton />}>
                <ToggleFavoriteBook id={userId} bookId={id} bookTitle={book.title} />
              </Suspense>
            </div>

            <div className="mt-6 text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Downloads:</strong>{' '}
                {book.download_count ? book.download_count.toLocaleString() : 'N/A'}
              </p>
              <p>
                <strong>Source:</strong> {book.source || 'Unknown'}
              </p>
              <p>
                <strong>Copyright:</strong> {book.copyright ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
