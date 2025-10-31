import React from 'react';
import {Library} from 'lucide-react';
import Link from 'next/link';
import {Button} from '../ui/button';
import {Input} from '../ui/input';

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
          <form className="flex items-center gap-2">
            <Input
              placeholder="Search..."
              className="rounded-full bg-muted/50 backdrop-blur-md border-none focus-visible:ring-1 focus-visible:ring-primary w-[180px] sm:w-[260px]"
            />
            <Button className="rounded-full">Search</Button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Header;
