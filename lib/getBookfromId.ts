'use server';
import type {Book} from '@/types';

export async function getBookfromId(
  supabase: any,
  id: string
): Promise<{data: Book | null; error: Error | null}> {
  const {data, error} = await supabase.from('books').select('*').eq('id', id).single();

  return {data, error};
}
