import { PlayerProfile } from '@/components/PlayerProfile';
import { db } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PlayerPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const player = await db.player.findUnique({
    where: { id: params.id },
    select: { nickname: true },
  });

  if (!player) {
    return {
      title: 'Player Not Found',
    };
  }

  return {
    title: `${player.nickname}'s Profile - CAMR Rankings`,
    description: `View ${player.nickname}'s mahjong statistics and ranking information.`,
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  // Verify player exists
  const player = await db.player.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!player) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <PlayerProfile playerId={params.id} />
    </main>
  );
} 