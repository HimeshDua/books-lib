import SelectBookCategory from '@/components/book/bookCategory';
import BookFallback from '@/components/book/bookFallback';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {createClient} from '@/lib/supabase/server';
import type {Book} from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React, {Suspense} from 'react';

const PAGE_SIZE = 12;
function PaginationControls({page, totalPages}: {page: number; totalPages: number}) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav className="flex items-center justify-center gap-3 mt-10  w-full" aria-label="Pagination">
      <Button className="rounded-2xl" variant="outline" size="sm" disabled={nextDisabled}>
        <Link href={`/?page=${Math.max(1, page - 1)}`} aria-disabled={prevDisabled}>
          ← Prev
        </Link>
      </Button>

      <div className="px-3 py-2 rounded-full bg-muted text-sm font-semibold min-w-[80px] text-center">
        Page {page} / {totalPages || 1}
      </div>

      <Button className="rounded-2xl" variant="outline" size="sm" disabled={nextDisabled}>
        <Link href={`/?page=${Math.min(totalPages || 1, page + 1)}`} aria-disabled={nextDisabled}>
          Next →
        </Link>
      </Button>
    </nav>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{page?: string; q?: string; category?: string}>;
}) {
  const supabase = await createClient();
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const query = ((await searchParams).q || '').trim();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const selectColumns = 'id,title,author,cover_url,download_count';
  const builder = supabase
    .from('books')
    .select(selectColumns, {count: 'exact'})
    .order('download_count', {ascending: false})
    .range(from, to);

  const category = (await searchParams).category || 'All';
  if (category !== 'All') builder.contains('bookshelves', [category]);

  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    builder.or(`title.ilike.%${trimmedQuery}%,author.ilike.%${trimmedQuery}%`);
  }

  const {data: dataBooks, error, count} = await builder;
  const books: Book[] = (dataBooks ?? []) as Book[];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <h2 className="text-lg font-semibold mb-2">Failed to load books</h2>
          <p className="text-sm text-destructive">{error.message}</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 p-2 sm:p-0">
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Public Library</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 text-balance">
              Free public-domain books — curated, searchable, and mobile-first.
            </p>
          </div>

          <SelectBookCategory className="block" />
        </header>

        <Separator />

        <Suspense fallback={<BookFallback />}>
          <section className="mt-6">
            {books && books.length > 0 ? (
              <ul
                className="
    group/card-grid
    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6
    gap-4 transition-all duration-300
  "
              >
                {books.map((book: Book) => (
                  <li
                    key={book.id}
                    className="
                    group/card relative transition-all duration-300
                    hover:scale-[1.05] hover:z-10
                    group-hover/card-grid:blur-[2px] group-hover/card-grid:opacity-70
                    hover:!opacity-100 hover:!blur-none
                  "
                  >
                    <Link
                      target="_blank"
                      href={`/book/${book.id}`}
                      aria-label={`Open ${book.title}`}
                      className="block"
                    >
                      <div className="relative w-full aspect-[3/4] bg-muted rounded-md overflow-hidden shadow-sm">
                        {book.cover_url ? (
                          <Image
                            src={book.cover_url}
                            alt={book.title}
                            fill
                            sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-600 ease-out group-hover/card:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            No cover
                          </div>
                        )}
                      </div>

                      <div className="p-3 transition-all duration-300">
                        <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {book.author || 'Unknown'}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {book.download_count
                              ? `${book.download_count.toLocaleString()} downloads`
                              : ''}
                          </span>
                          <span className="rounded-full px-2 py-1 bg-muted text-[11px]">
                            {book.id}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-20 text-center text-muted-foreground">
                <p className="text-sm">
                  No books found. Try a different search or come back later.
                </p>
              </div>
            )}
          </section>
        </Suspense>
        <div className="mt-6">
          <PaginationControls page={page} totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
