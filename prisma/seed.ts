import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all existing games and players
  await prisma.game.deleteMany();
  await prisma.player.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      isAdmin: true,
      player: {
        create: {
          nickname: 'Admin',
          points: 0,
          rank: '新人',
        },
      },
    },
  });

  // Create test users
  await Promise.all(
    Array.from({ length: 4 }, async (_, i) => {
      const userNumber = i + 1;
      const email = `player${userNumber}@example.com`;
      const nickname = `Player ${userNumber}`;
      return prisma.user.create({
        data: {
          email,
          name: nickname,
          isAdmin: false,
          player: {
            create: {
              nickname,
              points: 0,
              rank: '新人',
            },
          },
        },
      });
    })
  );

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 