'use client';

import {useEffect, useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import {getUserById} from '@/lib/getUserId';
import Image from 'next/image';
import Link from 'next/link';
import {Heart, LibraryBig, Loader2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {motion} from 'framer-motion';
import type {Book} from '@/types';

type FavoriteResponse = {
  books: Book[];
};

export default function FavoritesPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      const supabase = createClient();
      const {userId} = await getUserById(supabase);

      const {data, error} = await supabase
        .from('favorites')
        .select('book_id, books(id, title, author, cover_url)')
        .eq('user_id', userId)
        .order('id', {ascending: false})
        .returns<FavoriteResponse[]>();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const mapped = data.flatMap(fav => fav.books || []).filter(Boolean);
      setBooks(mapped);
      setLoading(false);
    }
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-muted-foreground">
        <Loader2 className="animate-spin w-6 h-6 mb-2" />
        <p>Loading your favorite reads...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
        <Heart className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-2xl font-bold">No Favorite Books Yet</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          You haven’t added any favorites yet — start exploring and show some love!
        </p>
        <Link href="/">
          <Button className="rounded-full px-6">Browse Library</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LibraryBig className="w-6 h-6 text-primary" />
              Your Favorites
            </h1>
            <p className="text-muted-foreground text-sm">
              {books.length} {books.length === 1 ? 'book' : 'books'} you loved ❤️
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="rounded-full">
              Discover More
            </Button>
          </Link>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {books.map(book => (
            <motion.div
              key={book.id}
              whileHover={{scale: 1.03, y: -4}}
              transition={{type: 'spring', stiffness: 300, damping: 20}}
              className="group relative bg-card/70 backdrop-blur-md border border-border/40 shadow-sm hover:shadow-md rounded-2xl overflow-hidden"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                {book.cover_url ? (
                  <Image
                    src={book.cover_url}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                    No Cover
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-background/60 rounded-full p-1.5 backdrop-blur-sm">
                  <Heart className="w-4 h-4 text-red-500" fill="red" />
                </div>
              </div>

              <div className="p-3 space-y-1">
                <h3 className="font-semibold truncate">{book.title}</h3>
                {book.author && (
                  <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
