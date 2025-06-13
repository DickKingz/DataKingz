const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const june13Start = new Date('2024-06-13T00:00:00Z');
  const june14Start = new Date('2024-06-14T00:00:00Z');

  // Step 1: Get all match IDs for June 13
  const matches = await prisma.match.findMany({
    where: {
      startTime: {
        gte: june13Start,
        lt: june14Start
      }
    },
    select: { id: true }
  });
  const matchIds = matches.map(m => m.id);
  console.log('Found', matchIds.length, 'matches on 2024-06-13');

  // Step 2: Get all player names for those matches, only real players
  const players = await prisma.matchToPlayer.findMany({
    where: {
      matchId: { in: matchIds },
      isSmartBot: null // Only real players
    },
    select: { player: { select: { name: true } } }
  });

  // Step 3: Unique names
  const uniqueNames = Array.from(new Set(players.map(p => p.player.name)));
  console.log('Unique real player names on 2024-06-13:', uniqueNames.length);
  console.log(uniqueNames);

  await prisma.$disconnect();
})(); 