import React from 'react';
import {ThemeSwitcher} from '@/components/theme-switcher';
import {Home, Library} from 'lucide-react';
import Link from 'next/link';
import {Button} from '../ui/button';

function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Library className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg tracking-tight hidden sm:block">Public Library</span>
          </Link>
        </div>

        <div className="hidden sm:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/#categories" className="hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/#trending" className="hover:text-primary transition-colors">
            Trending
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          <Button asChild size="sm" variant="ghost" className="sm:hidden">
            <Link href="/">
              <Home className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
