import {Library} from 'lucide-react';
import Link from 'next/link';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {UserMenu} from '../user-menu';

function Header() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50 supports-[backdrop-filter]:bg-background/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Library className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg tracking-tight hidden sm:block">
            Public Library
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <UserMenu />
          <div className="flex order-1 md:order-2 items-center gap-2">
            <form className="flex items-center gap-2">
              <Input
                name="q"
                placeholder="Search title or author"
                aria-label="Search books by title or author"
                className="rounded-full  backdrop-blur-md w-[180px] sm:w-[260px]"
              />
              <Button className="hidden md:flex rounded-full">Search</Button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
