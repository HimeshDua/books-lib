'use client';

import {useEffect, useState} from 'react';
import {Loader2} from 'lucide-react';

export default function BookReader({slug}: {slug: string}) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHtml = async () => {
      console.log(`Fetching book with slug: ${slug}`);
      try {
        const res = await fetch(`/api/readbook/${slug}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        if (data.html) setHtml(data.html);
        else throw new Error('No HTML content found');
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchHtml();
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-red-500">
        <h2 className="text-xl font-semibold mb-2">❌ Failed to load book</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="min-h-[96.4vh] flex flex-col items-center justify-center text-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mb-3 text-primary" />
        <p>Loading the book content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[96.4vh] flex flex-col bg-background text-foreground">
      {/* Book Content */}
      <article
        className="prose dark:prose-invert max-w-3xl mx-auto p-6 md:p-8 leading-relaxed tracking-wide"
        dangerouslySetInnerHTML={{__html: html}}
      />

      {/* Footer Attribution */}
      <footer className="border-t border-muted py-6 mt-auto text-center text-sm text-muted-foreground">
        <p>
          📚 This book content is sourced from the{' '}
          <a
            href="https://www.gutenberg.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Project Gutenberg
          </a>{' '}
          public domain collection.
        </p>
        <p className="mt-1">
          Powered by <strong>GudenIndex API</strong> — providing access to <strong>30,000+</strong>{' '}
          free books worldwide.
        </p>
      </footer>
    </div>
  );
}
