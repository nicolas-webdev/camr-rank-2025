import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const players = [
  { nickname: 'Nico', legajo: 2, realName: 'Nicolas Pfleger', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Tacosss/117735022' },
  { nickname: 'Lucio', legajo: 123, realName: 'Lucio', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'DrMelon' },
  { nickname: 'Adrian', legajo: 11, realName: 'Adrian Porta', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Kamai/117355118' },
  { nickname: 'Lucas', legajo: 9, realName: 'Lucas P', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'daibutsu' },
  { nickname: 'Mati', legajo: 1, realName: 'Matias Alloatti', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Matute' },
  { nickname: 'Mauro', legajo: 15, realName: 'Mauro', nationality: 'Chilena', tenhouName: '', mahjongSoulName: 'chuuren_c' },
  { nickname: 'Guile', legajo: 4, realName: 'Guile', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'TAMIYO' },
  { nickname: 'Haku/Kozi', legajo: 17, realName: 'Facundo Zorrilla Jimenez', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Hakundo' },
  { nickname: 'Jess', legajo: 21, realName: 'Jess', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'JessFo/113302126' },
  { nickname: 'Pato', legajo: 6, realName: 'Pato', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Scipio' },
  { nickname: 'Chiwi', legajo: 5, realName: 'Claudio', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Chiwi' },
  { nickname: 'Fran', legajo: 24, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Francis1265' },
  { nickname: 'Marce', legajo: 7, realName: 'Marcelo', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Marcelomecozzi' },
  { nickname: 'Javilo', legajo: 27, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'javilo' },
  { nickname: 'Andres', legajo: 18, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Phibrizzo' },
  { nickname: 'German', legajo: 10, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Ger11Man' },
  { nickname: 'Fofo', legajo: 33, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'MasterFofo/120655077' },
  { nickname: 'Ailén', legajo: 12, realName: 'Ailén', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Airenea' },
  { nickname: 'Kime', legajo: 69, realName: 'Nicolas Ishihara', nationality: 'Japonesa', tenhouName: '', mahjongSoulName: 'ニコラスNPM' },
  { nickname: 'Paula', legajo: 23, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'PrivateIdaho' },
  { nickname: 'Huan', legajo: 26, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Skunkix' },
  { nickname: 'Guille', legajo: 77, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'reokuro' },
  { nickname: 'Laura', legajo: 38, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: '' },
  { nickname: 'Juli', legajo: 136, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'junchan_e' },
  { nickname: 'Claudia', legajo: 14, realName: 'Claudia', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Ophiuchus' },
  { nickname: 'Danbliz', legajo: 20, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Danbliz' },
  { nickname: 'Lukas', legajo: 3, realName: 'Lucas', nationality: 'Argentina', tenhouName: '', mahjongSoulName: '' },
  { nickname: 'Leo', legajo: 13, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: '' },
  { nickname: 'Gabriela', legajo: 16, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Gabyybg' },
  { nickname: 'Daniel', legajo: 42, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: '' },
  { nickname: 'Mel', legajo: 813, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Politeia' },
  { nickname: 'Walt', legajo: 9023, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: '' },
  { nickname: 'Buli', legajo: 999, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: '' },
  { nickname: 'Lloocky', legajo: 201, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: '' },
  { nickname: 'Mati G', legajo: 8, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: '' },
  { nickname: 'Tomas', legajo: 19, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'DonLapa/126223342' },
  { nickname: 'Diego', legajo: 73, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: '' },
  { nickname: 'MegaJL', legajo: 22, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'MegaJL' },
  { nickname: 'San', legajo: 25, realName: '', nationality: 'Argentina', tenhouName: '', mahjongSoulName: 'Anatogis' }
];

async function main() {
  console.log('Start seeding...');

  // Clear existing players
  await prisma.player.deleteMany();

  // Create new players
  for (const player of players) {
    const result = await prisma.player.create({
      data: player
    });
    console.log(`Created player with id: ${result.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 