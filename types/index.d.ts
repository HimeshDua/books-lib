export type Book = {
  id: number;
  title: string;
  author: string;
  languages: string[];
  description: string | null;
  download_links: {
    pdf?: string;
    epub?: string;
  } | null;
  download_count: number | null;
  source: string | null;
  copyright: boolean;
  cover_url: string | null;
  bookshelves: string[];
};
