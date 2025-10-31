import React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="mt-24 border-t border-border/40 py-10 text-center">
      <div className="max-w-5xl mx-auto px-6 space-y-6 sm:space-y-4">
        {/* Project credit */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Built with <span className="text-rose-500">❤️</span> by{' '}
          <Link
            href="https://himeshdua.vercel.app"
            target="_blank"
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            Himesh Dua
          </Link>
          . Idea by <span className="font-medium text-foreground">M. Afan</span> — making reading
          truly free for everyone.
        </p>

        {/* API credit */}
        <p className="text-xs sm:text-sm text-muted-foreground">
          Powered by{' '}
          <a
            href="https://gutendex.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Gutendex API
          </a>{' '}
          — delivering <span className="font-semibold text-foreground">30,000+</span> public-domain
          books.
        </p>

        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mt-6" />
      </div>
    </footer>
  );
}

export default Footer;
