'use client';

import React, {useEffect, useState} from 'react';
import {Button} from '../ui/button';
import {HeartIcon, HeartOffIcon} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import {toast} from 'sonner';
import {ConfettiButton} from '../ui/confetti';
import AuthDialog from '../auth-dialog';

type Props = {
  id: string | null;
  bookId: string;
  bookTitle: string;
};

function ToggleFavoriteBook({id, bookId, bookTitle}: Props) {
  const [loading, setLoading] = useState(false);
  const [isExists, setIsExists] = useState(false);

  useEffect(() => {
    const fetchFavorite = async () => {
      const supabase = createClient();
      const {data, error: selectError} = await supabase
        .from('favorites')
        .select('user_id')
        .eq('user_id', id)
        .eq('book_id', bookId)
        .maybeSingle();

      if (selectError) {
        console.error('Select error:', selectError);
        toast.error('Failed to check favorite status');
        return;
      }

      setIsExists(!!data);
    };

    if (id && bookId) {
      fetchFavorite();
    }
  }, [id, bookId]);

  const handleToggleFavorite = async () => {
    if (!id || !bookId) return;
    if (!bookTitle) {
      console.error('Book Title not found!');
      toast.error('Book title is missing');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      if (isExists) {
        const {error: deleteError} = await supabase
          .from('favorites')
          .delete()
          .match({user_id: id, book_id: bookId});

        if (deleteError) {
          console.error('Delete error:', deleteError);
          toast.error('Failed to remove from favorites');
          return;
        }

        setIsExists(false);
        toast.success(`Removed "${bookTitle}" from favorites`);
      } else {
        const {error: insertError} = await supabase
          .from('favorites')
          .insert({book_id: bookId, user_id: id});

        if (insertError) {
          console.error('Insert error:', insertError);
          toast.error('Failed to add to favorites');
          return;
        }

        setIsExists(true);
        toast.success(`Added "${bookTitle}" to favorites`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {id ? (
        !loading ? (
          <ConfettiButton turnConfettiOn={!isExists}>
            <Button
              variant="destructive"
              className={`${
                isExists ? 'bg-red-800 hover:bg-red-800/90' : 'bg-red-600 hover:bg-red-600/90'
              }`}
              onClick={handleToggleFavorite}
            >
              {isExists ? 'Remove from favorites' : 'Add to favorites'}

              {isExists ? <HeartOffIcon /> : <HeartIcon />}
            </Button>
          </ConfettiButton>
        ) : (
          <ToggleFavoriteBookSkeleton />
        )
      ) : (
        <AuthDialog
          description="save favorites"
          dialogTrigger={
            <Button variant="destructive">
              Add to favorites <HeartIcon />
            </Button>
          }
        />
      )}
    </>
  );
}

export default ToggleFavoriteBook;

export const ToggleFavoriteBookSkeleton = () => {
  return (
    <Button className="bg-red-700 hover:bg-red-700/90" variant="destructive">
      <div className="w-20 h-4 animate-pulse duration-1000  bg-destructive-foreground/30 rounded"></div>
    </Button>
  );
};
