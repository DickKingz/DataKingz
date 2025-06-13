import { Augment, Champion, Item, TeamComposition, GauntletData } from '../types';

export const mockAugments: Augment[] = [
  {
    id: '1',
    name: 'Band of Thieves I',
    description: 'Your team gains bonus gold after combat.',
    tier: 'S',
    type: 'silver',
  },
  {
    id: '2',
    name: 'Rolling for Days I',
    description: 'Gain a free reroll each turn.',
    tier: 'S',
    type: 'silver',
  },
  {
    id: '3',
    name: 'Latent Forge',
    description: 'Gain components over time.',
    tier: 'S',
    type: 'silver',
  },
  {
    id: '4',
    name: 'Eye For An Eye',
    description: 'When allies take damage, deal damage to enemies.',
    tier: 'S',
    type: 'silver',
  },
  {
    id: '5',
    name: 'Delayed Start',
    description: 'Start with less health but gain powerful bonuses.',
    tier: 'A',
    type: 'silver',
  },
  {
    id: '6',
    name: 'Support Mining',
    description: 'Support items grant bonus effects.',
    tier: 'A',
    type: 'silver',
  },
  {
    id: '7',
    name: 'Titanic Titan',
    description: 'Your strongest unit gains massive bonuses.',
    tier: 'A',
    type: 'gold',
  },
  {
    id: '8',
    name: 'Pandora\'s Bench',
    description: 'Bench space increases over time.',
    tier: 'B',
    type: 'gold',
  },
  {
    id: '9',
    name: 'Good For You',
    description: 'Gain bonuses for healthy play.',
    tier: 'B',
    type: 'prismatic',
  },
  {
    id: '10',
    name: 'Button Mash',
    description: 'Gain bonuses for active play.',
    tier: 'C',
    type: 'prismatic',
  }
];

export const mockChampions: Champion[] = [
  {
    id: '1',
    name: 'Nadalee',
    cost: 1,
    traits: ['Shapeshifter', 'Bastion'],
    tier: 'A',
  },
  {
    id: '2',
    name: 'Elko',
    cost: 2,
    traits: ['Frost', 'Vanguard'],
    tier: 'S',
  },
  {
    id: '3',
    name: 'Neeko',
    cost: 3,
    traits: ['Shapeshifter', 'Bastion'],
    tier: 'A',
  },
  {
    id: '4',
    name: 'Yuumi',
    cost: 4,
    traits: ['Sugarcraft', 'Mage'],
    tier: 'S',
  },
  {
    id: '5',
    name: 'Annie',
    cost: 5,
    traits: ['Sugarcraft', 'Mage'],
    tier: 'S',
  }
];

export const mockItems: Item[] = [
  {
    id: '1',
    name: 'Deathblade',
    description: 'Grants attack damage and critical strike chance.',
    components: ['B.F. Sword', 'B.F. Sword'],
    tier: 'S',
  },
  {
    id: '2',
    name: 'Infinity Edge',
    description: 'Critical strikes deal bonus damage.',
    components: ['B.F. Sword', 'Glove'],
    tier: 'S',
  },
  {
    id: '3',
    name: 'Hextech Gunblade',
    description: 'Spell damage heals the caster.',
    components: ['B.F. Sword', 'Needlessly Large Rod'],
    tier: 'A',
  },
  {
    id: '4',
    name: 'Guardian Angel',
    description: 'Revive with health after death.',
    components: ['Chain Vest', 'B.F. Sword'],
    tier: 'A',
  },
  {
    id: '5',
    name: 'Bramble Vest',
    description: 'Reflects damage to attackers.',
    components: ['Chain Vest', 'Chain Vest'],
    tier: 'B',
  },
  {
    id: '6',
    name: 'Warmogs Armor',
    description: 'Grants massive health regeneration.',
    components: ['Giant\'s Belt', 'Giant\'s Belt'],
    tier: 'B',
  },
  {
    id: '7',
    name: 'Zephyr',
    description: 'Banishes an enemy at start of combat.',
    components: ['Giant\'s Belt', 'Negatron Cloak'],
    tier: 'C',
  },
  {
    id: '8',
    name: 'Redemption',
    description: 'Heals allies when holder dies.',
    components: ['Giant\'s Belt', 'Tear of the Goddess'],
    tier: 'C',
  }
];

export const mockCompositions: TeamComposition[] = [
  {
    id: '1',
    name: 'Strategist Amp',
    tier: 'S',
    playstyle: 'PLAYSTYLE: FAST 9',
    difficulty: [1, 2, 3],
    champions: mockChampions,
    augments: mockAugments.slice(0, 4),
    earlyComp: mockChampions.slice(0, 4),
    itemPriority: mockItems.slice(0, 3),
    positioning: [
      { champion: mockChampions[0], position: { row: 3, col: 1 } },
      { champion: mockChampions[1], position: { row: 2, col: 2 } },
      { champion: mockChampions[2], position: { row: 3, col: 3 } },
      { champion: mockChampions[3], position: { row: 1, col: 4 } },
    ],
    stages: [
      {
        stage: 2,
        strategy: 'Either play around a strong winstreak AP early game (Example: Techies and Bastions) or lose streak with Cypher / Open Fort'
      },
      {
        stage: 3,
        strategy: 'If winstreaking, add other relevant traits, such as Strategists, Street Demons, or more Techies. If lose streaking, cash out Cypher at 3-7.'
      },
      {
        stage: 4,
        strategy: 'Level to 8 and look for Yuumi 2 and Annie 2. Don\'t overroll because we need to get to Level 9 / Samira. If you are stuck on 8, chase Yuumi 3.'
      }
    ],
    tip: 'Always play 5 AMP when possible. Play when you have econ and can get lots of tears. Positioning will change every game pending on the Street Demon hexes. Leftover AD on Samira, leftover Mana / Utility / AP on Annie.'
  },
  {
    id: '2',
    name: 'Frost Vanguard',
    tier: 'A',
    playstyle: 'PLAYSTYLE: SLOW ROLL',
    difficulty: [1, 2, 3, 4],
    champions: mockChampions.slice(1, 4),
    augments: mockAugments.slice(2, 6),
    earlyComp: mockChampions.slice(1, 3),
    itemPriority: mockItems.slice(0, 2),
    positioning: [
      { champion: mockChampions[1], position: { row: 3, col: 2 } },
      { champion: mockChampions[2], position: { row: 2, col: 3 } },
    ],
    stages: [
      {
        stage: 2,
        strategy: 'Focus on economy and finding early Frost units'
      },
      {
        stage: 3,
        strategy: 'Stabilize with Vanguard frontline'
      },
      {
        stage: 4,
        strategy: 'Push for 3-star carries'
      }
    ],
    tip: 'Prioritize tank items and crowd control effects.'
  }
];

export const mockGauntletData: GauntletData = {
  title: 'Illuvium Gauntlet Championship',
  description: 'Compete in the ultimate TFT tournament for exclusive rewards',
  duration: '7 Days',
  participants: 125000,
  status: 'Active',
  metaComps: [
    {
      name: 'Strategist Amp',
      winRate: 68,
      popularity: 24,
      keyUnits: ['Yuumi', 'Annie', 'Samira', 'Neeko']
    },
    {
      name: 'Frost Vanguard',
      winRate: 64,
      popularity: 18,
      keyUnits: ['Elko', 'Braum', 'Sejuani', 'Ashe']
    },
    {
      name: 'Sugarcraft Mage',
      winRate: 61,
      popularity: 15,
      keyUnits: ['Yuumi', 'Annie', 'Ziggs', 'Xerath']
    },
    {
      name: 'Shapeshifter',
      winRate: 58,
      popularity: 12,
      keyUnits: ['Neeko', 'Nadalee', 'Shyvana', 'Swain']
    },
    {
      name: 'Bastion Reroll',
      winRate: 55,
      popularity: 8,
      keyUnits: ['Nadalee', 'Poppy', 'Thresh', 'Milio']
    },
    {
      name: 'Multistriker',
      winRate: 52,
      popularity: 6,
      keyUnits: ['Irelia', 'Jinx', 'Katarina', 'Akali']
    }
  ],
  topPlayers: [
    { name: 'IlluviumMaster', points: 2847, rank: 5 },
    { name: 'TFTLegend', points: 2756, rank: 5 },
    { name: 'StrategyKing', points: 2689, rank: 4 },
    { name: 'MetaBreaker', points: 2634, rank: 4 },
    { name: 'GauntletPro', points: 2578, rank: 4 }
  ],
  rewards: [
    { tier: 'Champion', requirement: 'Top 100', reward: 'Exclusive Illuvium NFT + 5000 ILV' },
    { tier: 'Master', requirement: 'Top 500', reward: 'Rare Illuvial Skin + 2500 ILV' },
    { tier: 'Diamond', requirement: 'Top 1000', reward: 'Epic Illuvial + 1000 ILV' },
    { tier: 'Platinum', requirement: 'Top 5000', reward: 'Rare Illuvial + 500 ILV' },
    { tier: 'Gold', requirement: 'Top 10000', reward: 'Common Illuvial + 250 ILV' }
  ]
};