'use server';
import type {Book} from '@/types';
import type {SupabaseClient} from '@supabase/supabase-js';

export async function getBookfromId(
  supabase: SupabaseClient,
  id: string
): Promise<{data: Book | null; error: Error | null}> {
  const {data, error} = await supabase.from('books').select('*').eq('id', id).single();

  return {data, error};
}
