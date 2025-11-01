'use client';

import {createClient} from '@/lib/supabase/client';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {LogOut} from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <Button
      onClick={logout}
      variant="destructive"
      className="w-full flex items-center justify-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      Log Out
    </Button>
  );
}
