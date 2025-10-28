import BookReader from '@/components/readerPage';

export default async function ReadPage({params}: {params: Promise<{id: string}>}) {
  const id = (await params).id;
  return <BookReader slug={id} />;
}
