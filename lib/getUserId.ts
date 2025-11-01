import type {SupabaseClient} from '@supabase/supabase-js';

export async function getUserById(supabase: SupabaseClient): Promise<{userId: string | null}> {
  const {data, error} = await supabase.auth.getClaims();
  const user = data?.claims;
  const userId = user?.sub ?? null;

  if (error) {
    console.error('Error fetching userId: ', error);
    return {userId: null};
  }

  return {userId};
}
