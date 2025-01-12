import { Suspense } from 'react';
import PlayerProfileClient from '@/app/players/[id]/PlayerProfileClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerProfilePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <PlayerProfileClient playerId={id} />
    </Suspense>
  );
} 