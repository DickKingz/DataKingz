import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, getCountFromServer, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../data/firebase';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';
import { legendaryAugmentImageMap } from '../data/AugmentData/Legendary/legendaryAugmentImageMap';
import { synergyImprintImageMap } from '../data/AugmentData/Synergy/synergyImprintImageMap';
import axios from 'axios';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AnalyticsOverviewTab from './AnalyticsOverviewTab';
import AnalyticsMetaTab from './AnalyticsMetaTab';
import AnalyticsMatchHistoryTab from './AnalyticsMatchHistoryTab';

interface MatchResult {
  id: string;
  playerId: string;
  illuvial: string;
  augment: string;
  matchTime: number; // seconds
  date: string; // ISO string
  [key: string]: any;
}
interface Match {
  id: string;
  playerIds: string[];
  startTime: string;
  endTime: string;
  [key: string]: any;
}
interface Player {
  id: string;
  name: string;
  rating: number;
  [key: string]: any;
}
interface Round {
  id: string;
  [key: string]: any;
}

interface AnalyticsPageProps {
  onBack: () => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb'];

// Helper to get illuvial tier (from analytics or fallback to 1)
function getIlluvialTier(name: string, illuvials: any[]): number {
  const found = illuvials.find(i => i.name === name);
  if (!found) return 1;
  
  // Extract tier from the name if it contains stage information
  const stageMatch = name.match(/Stage(\d+)/);
  if (stageMatch) {
    const stage = parseInt(stageMatch[1]);
    // Map stage to tier based on the data files
    if (stage === 1) return 1;
    if (stage === 2) return 2;
    if (stage === 3) return 3;
  }
  
  // If no stage info, try to get tier from the data
  return found.tier || 1;
}
// Helper to get augment type (from analytics or fallback to 'Unknown')
function getAugmentType(name: string, augments: any[]): string {
  const found = augments.find(a => a.name === name);
  return found?.type || found?.category || 'Unknown';
}
// Helper to normalize illuvial image name
function normalizeIlluvialName(name: string) {
  if (!name) return '';
  // Remove any stage information from the name
  return name.replace(/Stage\d+/, '').replace(/\s+/g, '');
}
// Helper to get illuvial image URL by illuvial object
function getIlluvialImageUrl(illuvial: { Line: string, Stage: number }) {
  const { Line, Stage } = illuvial;
  return `https://media.illuvium.io/web/NFT/Illuvials/${Line}Stage${Stage}/${Line}Stage${Stage}_default_default_webp.3840x2160/${Line}Stage${Stage}_default_default.webp`;
}
// Helper to get augment image URL by name
function getAugmentImageUrl(name: string) {
  const sanitized = name.replace(/[^a-zA-Z0-9]/g, '');
  if (legendaryAugmentImageMap[sanitized]) {
    return legendaryAugmentImageMap[sanitized];
  }
  if (synergyImprintImageMap[sanitized]) {
    return synergyImprintImageMap[sanitized];
  }
  const imageName = name.replace(/\s+/g, '%20') + '.PNG';
  return `https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/Augments%2F${imageName}?alt=media`;
}

// Use environment variable if available, otherwise default to Render proxy
const API_URL = process.env.REACT_APP_API_URL || 'https://datakingz-proxy.onrender.com/api/gauntlet';
const AUTH_TOKEN = 'v4.public.eyJqdGkiOiJmMmE2ZWZjZTRjYzA0NmYzOGUxN2NiOTRjNjMxNTAwNyIsImlzcyI6ImdhdGV3YXkuaWx2LnByb2QiLCJhdWQiOiJnYXRld2F5LmlsdiIsInN1YiI6ImQ0NDMyODM2OWVmYTQ3YjdhZWZjNDIwOGE4ZDU1NzRmIiwiZXhwIjoiMjAyNi0wNi0xMlQwODoxNzowNS40NzE0NzY0WiIsInBhcnRuZXI6aWQiOiJkNDQzMjgzNjllZmE0N2I3YWVmYzQyMDhhOGQ1NTc0ZiIsInBhcnRuZXI6bmFtZSI6IlJpY2giLCJlcDphcmVuYTpsb2JieTpjcmVhdGUiOiJUcnVlIiwiZXA6YXJlbmE6Z2F1bnRsZXQ6c2VhcmNoIjoiVHJ1ZSJ9q-afHUr8WhtcMbdIRtV_7iz5aBWhFKDIy5271wAysd3KftsG4heY7vareIdNh9GyrSs12QjAxEAUixT6jnNqDQ.ZDQ0MzI4MzY5ZWZhNDdiN2FlZmM0MjA4YThkNTU3NGY';

// Helper to get winner from results
function getWinner(game: any): string {
  if (!Array.isArray(game.results) || game.results.length === 0) return '-';
  // Winner is the player with the highest rating or rank 1
  const byRank = game.results.find((r: any) => r.rank === 1);
  if (byRank) return byRank.player || '-';
  const byRating = [...game.results].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))[0];
  return byRating?.player || '-';
}

// Pie chart colors
const regionColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#0088FE', '#FF4444'];

// Add a simple tooltip component
const TooltipComponent: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <span className="relative group cursor-help">
    {children}
    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs px-2 py-1 rounded bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-lg border border-blue-700 transition-opacity duration-200">
      {text}
    </span>
  </span>
);

// Helper to get player avatar color
function getAvatarColor(name: string) {
  // Simple hash to color
  const colors = [
    'bg-blue-500', 'bg-cyan-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// Add a simple spinner component
const Spinner: React.FC = () => (
  <div className="flex items-center justify-center h-full w-full">
    <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  </div>
);

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onBack }) => {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    matchResults: 0,
    matches: 0,
    players: 0,
    rounds: 0,
  });

  // Mock/derived data for charts (replace with real aggregation logic)
  const [dauData, setDauData] = useState<any[]>([]);
  const [mauData, setMauData] = useState<any[]>([]);
  const [playerActivity, setPlayerActivity] = useState<any[]>([]);
  const [matchesPlayed, setMatchesPlayed] = useState<any[]>([]);
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [topIlluvials, setTopIlluvials] = useState<any[]>([]);
  const [topAugments, setTopAugments] = useState<any[]>([]);
  const [avgMatchTime, setAvgMatchTime] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [playerData, setPlayerData] = useState<any>(null);

  const [hideIlluvials, setHideIlluvials] = useState<string[]>([]);
  const [hideAugments, setHideAugments] = useState<string[]>([]);

  const [illuvialTierFilter, setIlluvialTierFilter] = useState<'All' | 1 | 2 | 3 | 4 | 5>('All');
  const [augmentTypeFilter, setAugmentTypeFilter] = useState('All');

  const [games, setGames] = useState<any[]>([]);

  const [topPlayersSort, setTopPlayersSort] = useState<'wins' | 'rating' | 'games'>('wins');
  const [topPlayersData, setTopPlayersData] = useState<any[]>([]);

  const [recentMatchesFilter, setRecentMatchesFilter] = useState<'24h' | '3d' | '1w' | '30d'>('24h');
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  // State for expanded match
  const [expandedMatchIdx, setExpandedMatchIdx] = useState<number | null>(null);

  // State for player search
  const [searchedPlayer, setSearchedPlayer] = useState<string>('');
  const [playerMatches, setPlayerMatches] = useState<any[]>([]);
  const [playerStats, setPlayerStats] = useState<any | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'meta' | 'history'>('overview');

  // Add state for pagination
  const [fetchingAllPages, setFetchingAllPages] = useState(false);

  // Update startDate when recentMatchesFilter changes
  useEffect(() => {
    const now = new Date();
    let newStart = new Date(now);
    if (recentMatchesFilter === '24h') newStart.setDate(now.getDate() - 1);
    else if (recentMatchesFilter === '3d') newStart.setDate(now.getDate() - 3);
    else if (recentMatchesFilter === '1w') newStart.setDate(now.getDate() - 7);
    else if (recentMatchesFilter === '30d') newStart.setDate(now.getDate() - 30);
    setStartDate(newStart);
    setEndDate(now);
  }, [recentMatchesFilter]);

  // Refetch data when startDate or endDate changes
  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // Compute recentMatches from games (no longer filter by date, just sort)
  const recentMatches = useMemo(() => {
    return [...games].sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [games]);

  // Helper to get match duration in mm:ss
  function getDuration(game: any): string {
    if (!game.startTime || !game.endTime) return '-';
    const ms = new Date(game.endTime).getTime() - new Date(game.startTime).getTime();
    if (isNaN(ms) || ms < 0) return '-';
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const remSec = sec % 60;
    return `${min}:${remSec.toString().padStart(2, '0')}`;
  }

  // --- Fun Facts ---
  const funFacts = useMemo(() => {
    if (!games.length) return [];
    let longestMatch: any = null;
    let shortestMatch: any = null;
    let maxDuration = -Infinity;
    let minDuration = Infinity;
    let mostFrequentWinner = null;
    let mostWins = 0;
    let biggestUpset: any = null;
    let maxRatingChange = -Infinity;
    const winnerCounts: Record<string, number> = {};
    const regionCounts: Record<string, number> = {};
    let mostPlayedRegion = null;
    let mostPlayedRegionCount = 0;
    let totalPlayers = 0;
    const uniqueRegions = new Set<string>();
    const playerGameCounts: Record<string, number> = {};
    let mostActivePlayer = null;
    let mostGamesPlayed = 0;

    games.forEach((game: any) => {
      // Duration
      if (game.startTime && game.endTime) {
        const duration = new Date(game.endTime).getTime() - new Date(game.startTime).getTime();
        if (duration > maxDuration) {
          maxDuration = duration;
          longestMatch = game;
        }
        if (duration < minDuration) {
          minDuration = duration;
          shortestMatch = game;
        }
      }
      // Winner
      if (Array.isArray(game.results) && game.results.length > 0) {
        const byRank = game.results.find((r: any) => r.rank === 1);
        const winner = byRank ? byRank.player : (game.results[0]?.player || null);
        if (winner) {
          winnerCounts[winner] = (winnerCounts[winner] || 0) + 1;
          if (winnerCounts[winner] > mostWins) {
            mostWins = winnerCounts[winner];
            mostFrequentWinner = winner;
          }
        }
        // Biggest rating change for winner
        if (byRank && typeof byRank.ratingChange === 'number' && Math.abs(byRank.ratingChange) > maxRatingChange) {
          maxRatingChange = Math.abs(byRank.ratingChange);
          biggestUpset = { ...game, winner: byRank.player, ratingChange: byRank.ratingChange };
        }
      }
      // Region
      const region = game.regionId || game.region || 'Unknown';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
      if (regionCounts[region] > mostPlayedRegionCount) {
        mostPlayedRegionCount = regionCounts[region];
        mostPlayedRegion = region;
      }
      uniqueRegions.add(region);
      // Players
      if (Array.isArray(game.players)) {
        totalPlayers += game.players.length;
        game.players.forEach((p: string) => {
          playerGameCounts[p] = (playerGameCounts[p] || 0) + 1;
          if (playerGameCounts[p] > mostGamesPlayed) {
            mostGamesPlayed = playerGameCounts[p];
            mostActivePlayer = p;
          }
        });
      }
    });
    return [
      {
        label: 'Longest Match',
        value: longestMatch ? getDuration(longestMatch) : '-',
        sub: longestMatch ? `${Array.isArray(longestMatch.players) ? longestMatch.players.join(', ') : '-'} (${longestMatch.regionId || longestMatch.region || '-'})` : ''
      },
      {
        label: 'Shortest Match',
        value: shortestMatch ? getDuration(shortestMatch) : '-',
        sub: shortestMatch ? `${Array.isArray(shortestMatch.players) ? shortestMatch.players.join(', ') : '-'} (${shortestMatch.regionId || shortestMatch.region || '-'})` : ''
      },
      {
        label: 'Most Frequent Winner',
        value: mostFrequentWinner || '-',
        sub: mostFrequentWinner ? `${mostWins} wins` : ''
      },
      {
        label: 'Biggest Rating Upset',
        value: biggestUpset ? `${biggestUpset.winner} (${biggestUpset.ratingChange > 0 ? '+' : ''}${biggestUpset.ratingChange})` : '-',
        sub: biggestUpset ? `${Array.isArray(biggestUpset.players) ? biggestUpset.players.join(', ') : '-'} (${biggestUpset.regionId || biggestUpset.region || '-'})` : ''
      },
      {
        label: 'Most Played Region',
        value: mostPlayedRegion || '-',
        sub: mostPlayedRegion ? `${mostPlayedRegionCount} matches` : ''
      },
      {
        label: 'Most Active Player',
        value: mostActivePlayer || '-',
        sub: mostActivePlayer ? `${mostGamesPlayed} games` : ''
      },
      {
        label: 'Avg Players per Match',
        value: games.length ? (totalPlayers / games.length).toFixed(2) : '-',
        sub: ''
      },
      {
        label: 'Unique Regions Played',
        value: uniqueRegions.size,
        sub: ''
      }
    ];
  }, [games]);

  // Memoized region data
  const regionData = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    games.forEach((game: any) => {
      const region = game.regionId || game.region || 'Unknown';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
    return Object.entries(regionCounts).map(([region, count]) => ({ region, count }));
  }, [games]);

  // Refactored fetch function with pagination
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setFetchingAllPages(true);
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();
    const count = 100; // Max per page
    let cursor: string | undefined = undefined;
    let allGames: any[] = [];
    let page = 0;
    let keepFetching = true;
    while (keepFetching) {
      const requestBody: any = {
        startDate: startDateStr,
        endDate: endDateStr,
        players: [],
        mode: "Ranked",
        count,
        cursor
      };
      console.log(`[Analytics] Fetching page ${page + 1} with request body:`, requestBody);
      try {
        const res: any = await axios.post(API_URL, requestBody);
        let responseData: any = res.data;
        if (typeof res.data === 'string') {
          try {
            responseData = JSON.parse(res.data);
          } catch (e) {
            console.error('Failed to parse response data:', e);
            break;
          }
        }
        let games: any[] = [];
        if (Array.isArray(responseData.games)) {
          games = responseData.games.map((game: any) => {
            let gameData: any = game;
            if (typeof game === 'string') {
              try { gameData = JSON.parse(game); } catch (e) { return null; }
            }
            return {
              ...gameData,
              players: Array.isArray(gameData.players) ? gameData.players : [],
              results: Array.isArray(gameData.results) ? gameData.results : [],
              startTime: gameData.startTime || gameData.start_time || gameData.createdAt || gameData.created_at,
              endTime: gameData.endTime || gameData.end_time || gameData.updatedAt || gameData.updated_at
            };
          }).filter(Boolean);
        }
        allGames = [...allGames, ...games];
        cursor = responseData.cursor || responseData.nextCursor || responseData.next_cursor;
        keepFetching = !!cursor && games.length === count;
        page++;
        if (!keepFetching) break;
      } catch (error) {
        console.error('API fetch error:', error);
        break;
      }
    }
    setGames([...allGames]);
    setFetchingAllPages(false);
    setLoading(false);

    // Total matches
    const totalMatches = games.length;
    console.log('Total matches:', totalMatches);

    // Unique players
    const allPlayers = games.flatMap((game: any) => {
      try {
        // Handle different possible player data structures
        if (Array.isArray(game.players)) return game.players;
        if (Array.isArray(game.results)) return game.results.map((r: any) => r.player).filter(Boolean);
        if (game.player) return [game.player];
        return [];
      } catch (e) {
        console.error('Error processing players for game:', e);
        return [];
      }
    });
    const uniquePlayers = [...new Set(allPlayers)];
    const totalPlayers = uniquePlayers.length;
    console.log('Total unique players:', totalPlayers);

    // Average match time (in seconds)
    const matchTimes = games.map((game: any) => {
      try {
        if (!game.startTime || !game.endTime) return 0;
        return new Date(game.endTime).getTime() - new Date(game.startTime).getTime();
      } catch (e) {
        console.error('Error calculating match time:', e);
        return 0;
      }
    });
    const avgMatchTime = matchTimes.length
      ? (matchTimes.reduce((a: number, b: number) => a + b, 0) / matchTimes.length) / 1000
      : 0;
    console.log('Average match time:', avgMatchTime);

    setTotals({
      matches: totalMatches,
      players: totalPlayers,
      matchResults: totalMatches,
      rounds: 0,
    });
    setAvgMatchTime(avgMatchTime);

    // --- Top Players Calculation ---
    const playerStats: Record<string, { wins: number; games: number; rating: number }> = {};
    games.forEach((game: any) => {
      try {
        if (Array.isArray(game.results) && game.results.length > 0) {
        // Find the highest rating in this game (winner)
        let winner = null;
        let maxRating = -Infinity;
        game.results.forEach((result: any) => {
            const player = result.player || result.name || result.id;
            const rating = result.rating || result.score || 0;
            if (!player) return;
            if (!playerStats[player]) {
              playerStats[player] = { wins: 0, games: 0, rating: 0 };
            }
            playerStats[player].games += 1;
            playerStats[player].rating = rating;
            if (rating > maxRating) {
              maxRating = rating;
              winner = player;
          }
        });
        if (winner) {
          playerStats[winner].wins += 1;
        }
        }
      } catch (e) {
        console.error('Error processing player stats:', e);
      }
    });

    // Convert to array and sort
    let playersArr = Object.entries(playerStats).map(([name, stats]) => ({ name, ...stats }));
    console.log('Top players data:', playersArr.slice(0, 5));
    if (topPlayersSort === 'wins') {
      playersArr = playersArr.sort((a, b) => b.wins - a.wins);
    } else if (topPlayersSort === 'rating') {
      playersArr = playersArr.sort((a, b) => b.rating - a.rating);
    } else if (topPlayersSort === 'games') {
      playersArr = playersArr.sort((a, b) => b.games - a.games);
    }
    setTopPlayersData([...playersArr]);

    // --- DAU (Daily Active Users) ---
    const dauMap: Record<string, Set<string>> = {};
    games.forEach((game: any) => {
      try {
        if (!game.startTime) return;
        const day = new Date(game.startTime).toISOString().slice(0, 10);
      if (!dauMap[day]) dauMap[day] = new Set();
        // Add all players from the game
        allPlayers.forEach((p: string) => dauMap[day].add(p));
      } catch (e) {
        console.error('Error processing DAU data:', e);
      }
    });
    const dauData = Object.entries(dauMap).map(([date, players]) => ({ date, users: players.size }));
    console.log('DAU data:', dauData);
    setDauData([...dauData]);

    // --- MAU (Monthly Active Users) ---
    const mauSet = new Set<string>();
    allPlayers.forEach((p: string) => mauSet.add(p));
    setMauData([{ month: 'This Month', users: mauSet.size }]);

    // --- Player Activity (Top 20) ---
    const playerGameCounts: Record<string, number> = {};
    allPlayers.forEach((p: string) => {
          playerGameCounts[p] = (playerGameCounts[p] || 0) + 1;
    });
    const playerActivity = Object.entries(playerGameCounts)
      .map(([playerId, count]) => ({ playerId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    console.log('Player activity data:', playerActivity);
    setPlayerActivity([...playerActivity]);

    // --- Matches Played (by Day) ---
    const matchesByDay: Record<string, number> = {};
    games.forEach((game: any) => {
      try {
        if (!game.startTime) return;
      const day = new Date(game.startTime).toISOString().slice(0, 10);
      matchesByDay[day] = (matchesByDay[day] || 0) + 1;
      } catch (e) {
        console.error('Error processing matches by day:', e);
      }
    });
    const matchesPlayed = Object.entries(matchesByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    console.log('Matches played data:', matchesPlayed);
    setMatchesPlayed([...matchesPlayed]);

    console.log(`[Analytics] Received ${games.length} matches for range ${startDateStr} to ${endDateStr}`);
  };

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Handle player search (exact match, case-insensitive)
  const handlePlayerSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    setSearchedPlayer(query);
    // Find matches where player is in game.players or game.results[].player (exact, case-insensitive)
    const matches = games.filter((game: any) => {
      const inPlayers = Array.isArray(game.players) && game.players.some((p: string) => p.toLowerCase() === query.toLowerCase());
      const inResults = Array.isArray(game.results) && game.results.some((r: any) => (r.player || '').toLowerCase() === query.toLowerCase());
      return inPlayers || inResults;
    });
    setPlayerMatches(matches);
    // Compute stats
    let total = matches.length;
    let wins = 0;
    let rankSum = 0;
    let rankCount = 0;
    let regionCounts: Record<string, number> = {};
    matches.forEach((game: any) => {
      if (Array.isArray(game.results)) {
        const playerResult = game.results.find((r: any) => (r.player || '').toLowerCase() === query.toLowerCase());
        if (playerResult) {
          if (playerResult.rank === 1) wins++;
          if (typeof playerResult.rank === 'number') {
            rankSum += playerResult.rank;
            rankCount++;
          }
        }
      }
      const region = game.regionId || game.region || 'Unknown';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
    setPlayerStats({
      name: query,
      total,
      wins,
      avgRank: rankCount ? (rankSum / rankCount).toFixed(2) : '-',
      winRate: total ? ((wins / total) * 100).toFixed(1) + '%' : '-',
      mostPlayedRegion: Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-700/50 backdrop-blur-sm"
      >
        Back
      </button>
      {/* Tab Bar */}
      <div className="flex gap-2 mb-8 border-b border-gray-800">
        <button
          className={`px-6 py-2 font-bold rounded-t-xl transition-all duration-200 shadow-md relative
            ${activeTab === 'overview'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg z-10 scale-105'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-6 py-2 font-bold rounded-t-xl transition-all duration-200 shadow-md relative
            ${activeTab === 'meta'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg z-10 scale-105'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('meta')}
        >
          Meta
        </button>
        <button
          className={`px-6 py-2 font-bold rounded-t-xl transition-all duration-200 shadow-md relative
            ${activeTab === 'history'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg z-10 scale-105'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('history')}
        >
          Match History
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <AnalyticsOverviewTab
          totals={totals}
          avgMatchTime={avgMatchTime}
          funFacts={funFacts}
          dauData={dauData}
          mauData={mauData}
          regionData={regionData}
          regionColors={regionColors}
          matchesPlayed={matchesPlayed}
          playerActivity={playerActivity}
        />
      )}
      {activeTab === 'meta' && (
        <AnalyticsMetaTab
          topIlluvials={topIlluvials}
          topAugments={topAugments}
          illuvialTierFilter={illuvialTierFilter}
          setIlluvialTierFilter={setIlluvialTierFilter}
          augmentTypeFilter={augmentTypeFilter}
          setAugmentTypeFilter={setAugmentTypeFilter}
          getIlluvialTier={getIlluvialTier}
          getIlluvialImageUrl={getIlluvialImageUrl}
          getAugmentType={getAugmentType}
          getAugmentImageUrl={getAugmentImageUrl}
        />
      )}
      <div className="relative">
        {(loading || fetchingAllPages) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
            <Spinner />
          </div>
        )}
        {/* Match History Section */}
        {activeTab === 'history' && (
          <AnalyticsMatchHistoryTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handlePlayerSearch={handlePlayerSearch}
            playerStats={playerStats}
            searchedPlayer={searchedPlayer}
            playerMatches={playerMatches}
            expandedMatchIdx={expandedMatchIdx}
            setExpandedMatchIdx={setExpandedMatchIdx}
            getAvatarColor={getAvatarColor}
            getDuration={getDuration}
            getWinner={getWinner}
            TooltipComponent={TooltipComponent}
            recentMatches={recentMatches}
            recentMatchesFilter={recentMatchesFilter}
            setRecentMatchesFilter={setRecentMatchesFilter}
          />
        )}
        {/* Recent Matches Section (if not in history tab) */}
        {activeTab !== 'history' && (
          <div className="mt-6">
            {/* Place your Recent Matches card/table here, wrapped in the same relative/overlay logic if needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage; 