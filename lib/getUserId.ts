export async function getUserById(supabase: any): Promise<{userId: string | null}> {
  const {data, error} = await supabase.auth.getClaims();
  const user = data?.claims;
  const userId = user?.sub;

  if (error) {
    console.error('Error fetching userId: ', error);
    return {userId: null};
  }

  return {userId};
}
