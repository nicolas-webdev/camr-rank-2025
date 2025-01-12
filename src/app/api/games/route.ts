import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { db } from '@/lib';
import { calculatePointsForPosition, getRankByPoints } from '@/lib/ranking';
import type { Session } from 'next-auth';
import type { Position as GamePosition } from '@/lib/ranking';
import type { RankTitle } from '@/lib/ranking';
import { revalidatePath } from 'next/cache';

// Extend Session type to include id
interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

// Define position type with points earned
interface Position {
  playerId: string;
  score: number;
  position: GamePosition;
  pointsEarned?: number;
}

const gameSchema = z.object({
  date: z.string().datetime(),
  isHanchan: z.boolean(),
  eastPlayerId: z.string(),
  eastScore: z.number(),
  southPlayerId: z.string(),
  southScore: z.number(),
  westPlayerId: z.string(),
  westScore: z.number(),
  northPlayerId: z.string(),
  northScore: z.number(),
}).refine(
  (data) => {
    const playerIds = [data.eastPlayerId, data.southPlayerId, data.westPlayerId, data.northPlayerId];
    const uniquePlayerIds = new Set(playerIds);
    return uniquePlayerIds.size === 4;
  },
  {
    message: "Each player can only play in one position per game",
    path: ["players"]
  }
);

// GET is public - no authentication required
export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions) as ExtendedSession;
    const user = session?.user?.id ? await db.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    }) : null;
    const isAdmin = !!user?.isAdmin;

    const games = await db.game.findMany({
      where: {
        // Only show deleted games to admins
        isDeleted: isAdmin ? undefined : false,
      },
      include: {
        eastPlayer: true,
        southPlayer: true,
        westPlayer: true,
        northPlayer: true,
        createdBy: {
          select: { name: true }
        },
        updatedBy: {
          select: { name: true }
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(games, {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

// POST requires authentication
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    const body = await request.json();
    const validatedData = gameSchema.parse(body);

    // Create a new game and update player points
    const result = await db.$transaction(async (tx) => {
      // Get all players first with their stats
      const players = await tx.player.findMany({
        where: {
          id: {
            in: [
              validatedData.eastPlayerId,
              validatedData.southPlayerId,
              validatedData.westPlayerId,
              validatedData.northPlayerId
            ]
          }
        },
        include: {
          stats: true
        }
      });

      // Ensure all players were found
      const missingPlayers = [
        validatedData.eastPlayerId,
        validatedData.southPlayerId,
        validatedData.westPlayerId,
        validatedData.northPlayerId
      ].filter(id => !players.find(p => p.id === id));

      if (missingPlayers.length > 0) {
        throw new Error(`Players not found: ${missingPlayers.join(', ')}`);
      }

      // Initialize stats for players who don't have them
      for (const player of players) {
        if (!player.stats) {
          console.log(`Initializing stats for player ${player.nickname} (${player.id})`);
          await tx.stats.create({
            data: {
              playerId: player.id,
              // All other fields will use their default values as defined in the schema
            }
          });
        }
      }

      // Reload players with their newly created stats
      const playersWithStats = await tx.player.findMany({
        where: {
          id: {
            in: players.map(p => p.id)
          }
        },
        include: {
          stats: true
        }
      });

      // Verify all players now have stats
      const playersWithoutStats = playersWithStats.filter(p => !p.stats);
      if (playersWithoutStats.length > 0) {
        throw new Error(`Failed to initialize stats for players: ${playersWithoutStats.map(p => p.nickname).join(', ')}`);
      }

      // Calculate positions and points
      // IMPORTANT: Scoring rules for position determination:
      // 1. Higher score takes precedence
      // 2. In case of a tie (exact same score), wind position is used as tie-breaker
      //    with priority: East > South > West > North
      const getWindPriority = (position: GamePosition): number => {
        const priorities = { east: 0, south: 1, west: 2, north: 3 };
        return priorities[position];
      };

      const positions: Position[] = [
        { playerId: validatedData.eastPlayerId, score: validatedData.eastScore, position: 'east' as GamePosition },
        { playerId: validatedData.southPlayerId, score: validatedData.southScore, position: 'south' as GamePosition },
        { playerId: validatedData.westPlayerId, score: validatedData.westScore, position: 'west' as GamePosition },
        { playerId: validatedData.northPlayerId, score: validatedData.northScore, position: 'north' as GamePosition }
      ].sort((a, b) => {
        // First compare by score
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // If scores are equal, use wind position as tie-breaker
        const windPriorityA = getWindPriority(a.position);
        const windPriorityB = getWindPriority(b.position);
        
        // Log tie-break situation
        console.log('Tie-break situation detected:', {
          player1: {
            position: a.position,
            score: a.score,
            windPriority: windPriorityA
          },
          player2: {
            position: b.position,
            score: b.score,
            windPriority: windPriorityB
          }
        });
        
        return windPriorityA - windPriorityB;
      });

      // Log final positions after sorting and tie-breaking
      console.log('Final positions after sorting and tie-breaking:', positions.map((p, i) => ({
        finalPosition: i + 1,
        windPosition: p.position,
        score: p.score,
        playerId: p.playerId
      })));

      // Validate that we have exactly 4 positions after sorting
      if (positions.length !== 4) {
        throw new Error(`Invalid number of positions: ${positions.length}`);
      }

      // Log initial state for debugging
      console.log('Initial positions after sorting:', positions.map((p, i) => ({
        position: i + 1,
        playerId: p.playerId,
        score: p.score
      })));

      // Track rating changes for each player
      // NOTE: As of now, ratings are fixed at 1500 and do not change.
      // A proper rating system will be implemented in the future as a parallel system to ranks.
      // For now, we only track rank changes and points.
      const ratingChanges = new Map<string, { 
        oldRating: number;
        newRating: number;
        pointsBeforeGame: number;
        pointsAfterGame: number;
        change: number;
      }>();

      // Update each player's points and rank
      for (let i = 0; i < positions.length; i++) {
        const { playerId, score } = positions[i];
        const player = playersWithStats.find(p => p.id === playerId);
        if (!player || !player.stats) {
          throw new Error(`Player or stats not found for position ${i + 1}, playerId: ${playerId}`);
        }

        // Calculate points based on finishing position (i), not wind position
        const pointsChange = calculatePointsForPosition(i, validatedData.isHanchan, player.rank as RankTitle);
        
        // Log points calculation for debugging
        console.log(`Points calculation for position ${i + 1}:`, {
          playerId,
          playerNickname: player.nickname,
          score,
          currentRank: player.rank,
          pointsChange,
          isHanchan: validatedData.isHanchan
        });

        const newPoints = player.points + pointsChange;
        const newRank = getRankByPoints(newPoints, player.rank as RankTitle);

        // Store rating change information (keeping ratings fixed at 1500)
        ratingChanges.set(playerId, {
          oldRating: 1500,
          newRating: 1500,
          pointsBeforeGame: player.points,
          pointsAfterGame: newPoints,
          change: 0  // No rating changes for now
        });

        // Update player stats based on finishing position
        await tx.stats.update({
          where: { id: player.stats.id },
          data: {
            totalGames: { increment: 1 },
            ...(validatedData.isHanchan 
              ? { hanchanGames: { increment: 1 } }
              : { tonpuusenGames: { increment: 1 } }),
            ...(i === 0 ? { firstPlace: { increment: 1 } } :
               i === 1 ? { secondPlace: { increment: 1 } } :
               i === 2 ? { thirdPlace: { increment: 1 } } :
                        { fourthPlace: { increment: 1 } })
          }
        });

        // Update player with new rank and points (keeping rating fixed at 1500)
        await tx.player.update({
          where: { id: playerId },
          data: {
            points: newPoints,
            rank: newRank,
            rating: 1500,  // Keep rating fixed at 1500
            maxRating: 1500  // Keep max rating fixed at 1500
          }
        });

        // Update position with points earned for response
        positions[i].pointsEarned = pointsChange;

        // Log final state for this player
        console.log(`Updated state for position ${i + 1}:`, {
          playerId,
          playerNickname: player.nickname,
          oldPoints: player.points,
          newPoints,
          oldRank: player.rank,
          newRank,
          pointsChange
        });
      }

      // Create the game with rating changes
      const game = await tx.game.create({
        data: {
          ...validatedData,
          createdById: session.user.id,
          ratingChanges: {
            create: Array.from(ratingChanges.entries()).map(([playerId, change]) => ({
              statsId: playersWithStats.find(p => p.id === playerId)!.stats!.id,
              oldRating: change.oldRating,
              newRating: change.newRating,
              change: change.change
            }))
          }
        },
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
          ratingChanges: true,
          createdBy: {
            select: { name: true }
          }
        }
      });

      return { game, positions, ratingChanges: Array.from(ratingChanges.entries()) };
    });

    // Revalidate all pages that show player data
    revalidatePath('/');
    revalidatePath('/players');
    revalidatePath('/players/[id]', 'page');
    revalidatePath('/games');

    return NextResponse.json(result, {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create game';
    console.error('Failed to create game:', errorMessage);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
} 