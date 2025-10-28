import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {createClient} from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const PAGE_SIZE = 12;

type Book = {
  id: number;
  title: string;
  author?: string | null;
  cover_url?: string | null;
  download_count?: number;
};

function PaginationControls({page, totalPages}: {page: number; totalPages: number}) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav
      className="flex items-center gap-2 justify-center w-full"
      role="navigation"
      aria-label="Pagination Navigation"
    >
      <Link
        href={`/?page=${Math.max(1, page - 1)}`}
        aria-disabled={prevDisabled}
        className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
          prevDisabled ? 'opacity-40 pointer-events-none' : 'hover:bg-slate-100'
        }`}
        aria-label="Previous page"
      >
        ← Prev
      </Link>

      <div className="px-3 py-2 rounded-full bg-slate-100 text-sm font-semibold min-w-[80px] text-center">
        Page {page} / {totalPages || 1}
      </div>

      <Link
        href={`/?page=${Math.min(totalPages || 1, page + 1)}`}
        aria-disabled={nextDisabled}
        className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
          nextDisabled ? 'opacity-40 pointer-events-none' : 'hover:bg-slate-100'
        }`}
        aria-label="Next page"
      >
        Next →
      </Link>
    </nav>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{page?: string; q?: string}>;
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

  if (query) {
    builder.ilike('title', `%${query}%`).or(`author.ilike.%${query}%`);
  }

  const {data: books, error, count} = await builder;

  if (error) {
    console.error('Error fetching books:', error.message);
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <h2 className="text-lg font-semibold mb-2">Failed to load books</h2>
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex items-center gap-4 justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Public Library</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Free public-domain books — curated, searchable, and mobile-first.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Minimal search form — server-side via query param */}
            <form action="/" method="get" className="hidden sm:flex items-center gap-2">
              <input
                name="q"
                defaultValue={query}
                placeholder="Search title or author"
                className="px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-800"
                aria-label="Search books by title or author"
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        </header>

        <Separator />

        {/* Grid */}
        <section className="mt-6">
          {books && books.length > 0 ? (
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
              role="list"
            >
              {books.map((book: Book) => (
                <li key={book.id} className="group">
                  <Link href={`/book/${book.id}`} aria-label={`Open ${book.title}`}>
                    <div className="relative w-full aspect-[3/4] bg-slate-100 dark:bg-slate-700">
                      {book.cover_url ? (
                        <Image
                          src={book.cover_url}
                          alt={book.title}
                          fill
                          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                          priority={false}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-slate-500">
                          No cover
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {book.author || 'Unknown'}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span>
                          {book.download_count
                            ? `${book.download_count.toLocaleString()} downloads`
                            : ''}
                        </span>
                        <span className="rounded-full px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 text-[11px]">
                          {book.id}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-20 text-center text-slate-500">
              <p className="text-sm">No books found. Try a different search or come back later.</p>
            </div>
          )}
        </section>

        {/* Footer / Pagination */}
        <div className="mt-6">
          <PaginationControls page={page} totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
