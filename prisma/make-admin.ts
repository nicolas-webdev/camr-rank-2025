import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { id: 'cm5sg23iu0000541x917o21tf' },
    data: { isAdmin: true },
  });
  console.log('Successfully made user an admin');
}

main()
  .catch((e) => {
    console.error('Error making user admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 