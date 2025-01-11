import { Suspense } from 'react';
import { use } from 'react';
import PlayerProfileClient from './PlayerProfileClient';

interface PageParams {
  id: string;
}

export default function PlayerProfilePage({ params }: { params: PageParams }) {
  const { id } = use(Promise.resolve(params));

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