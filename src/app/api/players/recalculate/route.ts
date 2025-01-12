import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { recalculateAllPoints } from '@/lib/ranking';
import { Prisma } from '@prisma/client';

async function recalculateRanks() {
  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // First reset all ratings to 1500
      await tx.player.updateMany({
        data: {
          rating: 1500,
          maxRating: 1500
        }
      });

      // Then recalculate all points and ranks
      await recalculateAllPoints(tx);
    });

    return NextResponse.json({ message: 'Successfully recalculated all player ranks and reset ratings to 1500' });
  } catch (error) {
    console.error('Error recalculating ranks:', error);
    return NextResponse.json({ error: 'Failed to recalculate ranks' }, { status: 500 });
  }
}

export const GET = recalculateRanks;
export const POST = recalculateRanks; 