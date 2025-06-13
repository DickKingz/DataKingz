export interface Augment {
  id: string;
  name: string;
  description: string;
  tier: 'S' | 'A' | 'B' | 'C';
  type: 'silver' | 'gold' | 'prismatic';
  image?: string;
}

export interface Champion {
  id: string;
  name: string;
  cost: number;
  traits: string[];
  tier: 'S' | 'A' | 'B' | 'C';
  image?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  components?: string[];
  tier: 'S' | 'A' | 'B' | 'C';
  image?: string;
}

export interface TeamComposition {
  id: string;
  name: string;
  tier: 'S' | 'A' | 'B' | 'C';
  playstyle: string;
  difficulty: number[];
  champions: Champion[];
  augments: Augment[];
  earlyComp: Champion[];
  itemPriority: Item[];
  positioning: { champion: Champion; position: { row: number; col: number } }[];
  stages: { stage: number; strategy: string }[];
  tip: string;
}

export interface GauntletData {
  title: string;
  description: string;
  duration: string;
  participants: number;
  status: string;
  metaComps: {
    name: string;
    winRate: number;
    popularity: number;
    keyUnits: string[];
  }[];
  topPlayers: {
    name: string;
    points: number;
    rank: number;
  }[];
  rewards: {
    tier: string;
    requirement: string;
    reward: string;
  }[];
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  organizer: string;
  status: 'upcoming' | 'registration' | 'live' | 'completed';
  type: 'standard' | 'custom' | 'practice';
  format: 'single-elimination' | 'double-elimination' | 'swiss' | 'round-robin';
  maxParticipants: number;
  currentParticipants: number;
  prizePool: string;
  registrationStart: string;
  registrationEnd: string;
  startTime: string;
  endTime?: string;
  rounds: TournamentRound[];
  rules: string;
  hostPlatform: string;
  participants: TournamentParticipant[];
  bracket?: TournamentBracket;
}

export interface TournamentRound {
  roundNumber: number;
  name: string;
  format: 'bo1' | 'bo3' | 'bo5';
  startTime: string;
  advancingPlayers: number;
  status: 'pending' | 'live' | 'completed';
}

export interface TournamentParticipant {
  id: string;
  rangerName: string;
  illuviumPlayerId: string;
  registrationTime: string;
  status: 'registered' | 'checked-in' | 'eliminated' | 'advanced';
  currentRound?: number;
}

export interface TournamentBracket {
  rounds: BracketRound[];
}

export interface BracketRound {
  roundNumber: number;
  matches: BracketMatch[];
}

export interface BracketMatch {
  id: string;
  player1?: TournamentParticipant;
  player2?: TournamentParticipant;
  winner?: TournamentParticipant;
  matchCode?: string;
  status: 'pending' | 'live' | 'completed';
  startTime?: string;
}

// Authentication Types
export interface User {
  id: string;
  email: string;
  walletAddress: string;
  playerId: string; // Added player ID field from IMX Passport sub
  nickname?: string;
  isAdmin: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAdminStatus: (email: string) => boolean;
}