import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: 'admin-user',
      name: 'Admin',
      email: 'admin@example.com',
      isAdmin: true,
      player: {
        create: {
          nickname: 'Admin',
          rating: 1500,
        },
      },
    },
  });

  // Create test users and players
  const testUsers = [
    {
      id: 'test-user-1',
      name: 'Test User 1',
      email: 'test1@example.com',
      isAdmin: false,
      player: {
        create: {
          nickname: 'Player 1',
          rating: 1500,
        },
      },
    },
    {
      id: 'test-user-2',
      name: 'Test User 2',
      email: 'test2@example.com',
      isAdmin: false,
      player: {
        create: {
          nickname: 'Player 2',
          rating: 1500,
        },
      },
    },
    {
      id: 'test-user-3',
      name: 'Test User 3',
      email: 'test3@example.com',
      isAdmin: false,
      player: {
        create: {
          nickname: 'Player 3',
          rating: 1500,
        },
      },
    },
    {
      id: 'test-user-4',
      name: 'Test User 4',
      email: 'test4@example.com',
      isAdmin: false,
      player: {
        create: {
          nickname: 'Player 4',
          rating: 1500,
        },
      },
    },
  ];

  for (const userData of testUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 