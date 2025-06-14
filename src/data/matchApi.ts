import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface Match {
  id?: string;
  lobbyCode: string;
  players: string[];
  status: 'pending' | 'live' | 'completed';
  round: number;
  results?: any;
  createdAt?: string;
}

export async function createLobby(tournamentId: string, players: string[], round: number): Promise<string> {
  const lobbyCode = Math.random().toString(36).substr(2, 6).toUpperCase();
  const matchRef = collection(db, 'tournaments', tournamentId, 'matches');
  await addDoc(matchRef, {
    lobbyCode,
    players,
    status: 'pending',
    round,
    createdAt: new Date().toISOString(),
  });
  return lobbyCode;
}

export async function getMatchByLobbyCode(tournamentId: string, lobbyCode: string): Promise<Match | null> {
  const matchesRef = collection(db, 'tournaments', tournamentId, 'matches');
  const q = query(matchesRef, where('lobbyCode', '==', lobbyCode));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match))[0] || null;
}

export async function getMatchesForPlayer(tournamentId: string, playerId: string): Promise<Match[]> {
  const matchesRef = collection(db, 'tournaments', tournamentId, 'matches');
  const q = query(matchesRef, where('players', 'array-contains', playerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
} 