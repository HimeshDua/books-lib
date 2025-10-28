import React from 'react';

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 py-10 text-center">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Project credit */}
        <div className="text-sm text-balance text-slate-600 dark:text-slate-400">
          <p>
            Built with ❤️ by{' '}
            <span className="font-semibold text-slate-900 dark:text-white">Himesh Dua</span>. Idea
            credit goes to{' '}
            <span className="font-semibold text-slate-900 dark:text-white">M. Afan</span>. Inspired
            by the idea of making reading truly free for everyone.
          </p>
        </div>

        {/* Center: API credit */}
        <div className="text-xs text-balance sm:text-sm text-slate-500 dark:text-slate-400">
          <p>
            Powered by{' '}
            <a
              href="https://gutenindex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              GutenIndex API
            </a>{' '}
            — fetching over{' '}
            <span className="font-bold text-slate-900 dark:text-slate-100">30,000+</span>{' '}
            public-domain books from Project Gutenberg.
          </p>
        </div>
      </div>

      <div className="mt-6 text-xs text-slate-400">
        © {new Date().getFullYear()} Books Library. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
