import { PlayerProfile } from '@/components/PlayerProfile';
import { db } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const { id } = await params;
  const player = await db.player.findUnique({
    where: { id },
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

export const revalidate = 0; // Revalidate this page on every request

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  // Verify player exists
  const player = await db.player.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!player) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <PlayerProfile playerId={id} />
    </main>
  );
} 