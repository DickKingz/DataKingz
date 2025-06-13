import { prisma } from '../src/lib/prisma';

const ILLUVIUM_API_URL = 'https://api.illuvium.io/v1';
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface IlluviumItem {
  id: string;
  name: string;
  type: string;
  rarity: string;
  price: number;
  lastUpdated: Date;
}

interface ApiResponse {
  items: IlluviumItem[];
}

async function updateIlluviumData() {
  try {
    console.log('Fetching Illuvium data...');
    const response = await fetch(`${ILLUVIUM_API_URL}/market/items`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Illuvium API error: ${response.statusText}`);
    }

    const data = await response.json() as ApiResponse;

    // Process and store the data
    const items = data.items.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      rarity: item.rarity,
      price: item.price,
      lastUpdated: new Date(item.lastUpdated),
    }));

    // Store in database
    await prisma.illuviumItem.createMany({
      data: items,
      skipDuplicates: true,
    });

    console.log(`Successfully updated ${items.length} items`);
  } catch (error) {
    console.error('Error updating Illuvium data:', error);
  }
}

// Initial update
updateIlluviumData();

// Schedule periodic updates
setInterval(updateIlluviumData, UPDATE_INTERVAL);

console.log('Illuvium data update service started'); 