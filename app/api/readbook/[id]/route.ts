import {NextResponse} from 'next/server';

export async function GET(_: Request, {params}: {params: Promise<{id?: string}>}) {
  const id = (await params).id;
  // console.log('Fetching book with id:', id);
  if (!id) {
    return NextResponse.json({error: 'Missing id parameter'}, {status: 400});
  }

  const safeId = id.replace(/\D/g, '');
  if (!safeId) {
    return NextResponse.json({error: 'Invalid id parameter'}, {status: 400});
  }

  const url = `https://www.gutenberg.org/cache/epub/${safeId}/pg${safeId}-images.html`;

  try {
    const res = await fetch(url, {cache: 'no-store'});
    if (!res.ok) {
      return NextResponse.json({error: `Failed to fetch: ${res.status}`}, {status: res.status});
    }

    const html = await res.text();

    // html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    // .replace(/<style[\s\S]*?<\/style>/gi, '')
    // .replace('*** START OF THE PROJECT GUTENBERG EBOOK SONGS BEFORE SUNRISE ***', '');
    // .replace(/<head[\s\S]*?<\/head>/, '')
    // .replace(/<body[^>]*>/, '')
    // .replace(/<\/body>/, '')
    // .replace(/<a[^>]+href="https:\/\/www\.gutenberg\.org[^"]+"[^>]*>.*?<\/a>/g, '');

    return NextResponse.json({html});
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('Error fetching book:', e);
      return NextResponse.json({error: e?.message ?? 'Unknown error'}, {status: 500});
    } else {
      console.error('Unknown error fetching book:', e);
      return NextResponse.json({error: 'Unknown error'}, {status: 500});
    }
  }
}
