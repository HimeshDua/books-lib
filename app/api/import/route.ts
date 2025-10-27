import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server'; // use service_role key here

export async function POST() {
  const supabase = await createClient();
  const startPage = 1;
  const endPage = 999;
  const batchSize = 20; // tune this to balance between speed and rate limits
  const failedPages: {page: number; reason: string}[] = [];

  console.time('Book Import Duration');
  console.log(`Starting import from page ${startPage} to ${endPage}`);

  try {
    for (let page = startPage; page <= endPage; page++) {
      console.log(`🔄 Fetching page ${page}...`);
      let results;

      try {
        const res = await fetch(`https://gutendex.com/books?page=${page}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        results = data.results;
      } catch (fetchErr: any) {
        console.error(`❌ Failed to fetch page ${page}:`, fetchErr.message);
        failedPages.push({page, reason: fetchErr.message});
        continue; // move on to next page
      }

      // Process books in small batches to reduce DB load
      for (let i = 0; i < results.length; i += batchSize) {
        const batch = results.slice(i, i + batchSize);
        const upserts = batch.map((book: any) => ({
          title: book.title,
          author: book.authors?.map((a: any) => a.name).join(', ') || 'Unknown',
          cover_url: book.formats['image/jpeg'] || null,
          description: book.subjects?.slice(0, 5).join(', ') || null,
          languages: book.languages || [],
          download_links: {
            pdf: book.formats['application/pdf'] || book.formats['text/html'] || null,
            epub: book.formats['application/epub+zip'] || null,
          },
          source: 'gutenberg',
          bookshelves: book.bookshelves || [],
          copyright: book.copyright || false,
          download_count: book.download_count || 0,
        }));

        const {error} = await supabase.from('books').upsert(upserts);

        if (error) {
          console.error(`⚠️ Supabase insert error on page ${page}:`, error.message);
          failedPages.push({page, reason: error.message});
          break; // skip to next page
        }
      }

      console.log(`✅ Finished page ${page}`);
      await new Promise(r => setTimeout(r, 300)); // small delay to avoid rate limit
    }

    console.timeEnd('Book Import Duration');
    console.log(`Import completed with ${failedPages.length} failed pages.`);
    return NextResponse.json({
      success: true,
      failedPages,
      message: failedPages.length
        ? `Completed with ${failedPages.length} failed pages.`
        : 'All pages imported successfully.',
    });
  } catch (e: any) {
    console.error('💥 Fatal import error:', e);
    return NextResponse.json({success: false, error: e.message}, {status: 500});
  }
}
