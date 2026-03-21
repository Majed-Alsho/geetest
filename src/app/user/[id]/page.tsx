import PublicProfileView from '@/views/PublicProfile';

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  return <PublicProfileView userId={params.id} />;
}
