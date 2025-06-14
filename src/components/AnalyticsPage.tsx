import React, { useEffect, useState } from 'react';
import { collection, getDocs, getCountFromServer, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../data/firebase';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';
import { legendaryAugmentImageMap } from '../data/AugmentData/Legendary/legendaryAugmentImageMap';
import { synergyImprintImageMap } from '../data/AugmentData/Synergy/synergyImprintImageMap';
import axios from 'axios';

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

const API_URL = 'http://localhost:3001/api/gauntlet';
const AUTH_TOKEN = 'v4.public.eyJqdGkiOiJmMmE2ZWZjZTRjYzA0NmYzOGUxN2NiOTRjNjMxNTAwNyIsImlzcyI6ImdhdGV3YXkuaWx2LnByb2QiLCJhdWQiOiJnYXRld2F5LmlsdiIsInN1YiI6ImQ0NDMyODM2OWVmYTQ3YjdhZWZjNDIwOGE4ZDU1NzRmIiwiZXhwIjoiMjAyNi0wNi0xMlQwODoxNzowNS40NzE0NzY0WiIsInBhcnRuZXI6aWQiOiJkNDQzMjgzNjllZmE0N2I3YWVmYzQyMDhhOGQ1NTc0ZiIsInBhcnRuZXI6bmFtZSI6IlJpY2giLCJlcDphcmVuYTpsb2JieTpjcmVhdGUiOiJUcnVlIiwiZXA6YXJlbmE6Z2F1bnRsZXQ6c2VhcmNoIjoiVHJ1ZSJ9q-afHUr8WhtcMbdIRtV_7iz5aBWhFKDIy5271wAysd3KftsG4heY7vareIdNh9GyrSs12QjAxEAUixT6jnNqDQ.ZDQ0MzI4MzY5ZWZhNDdiN2FlZmM0MjA4YThkNTU3NGY';

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

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });

  useEffect(() => {
    setLoading(true);
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();
    const requestBody = {
      startDate: startDateStr,
      endDate: endDateStr
    };
    console.log('Sending request to proxy:', requestBody);
    axios.post(API_URL, requestBody)
      .then(res => {
        console.log('Received response from proxy:', res.data);
        const games = res.data.games || [];
        setGames(games);

        // Total matches
        const totalMatches = games.length;

        // Unique players
        const allPlayers = games.flatMap((game: any) => game.players);
        const uniquePlayers = [...new Set(allPlayers)];
        const totalPlayers = uniquePlayers.length;

        // Average match time (in seconds)
        const matchTimes = games.map((game: any) =>
          new Date(game.endTime).getTime() - new Date(game.startTime).getTime()
        );
        const avgMatchTime = matchTimes.length
          ? (matchTimes.reduce((a: number, b: number) => a + b, 0) / matchTimes.length) / 1000
          : 0;

        setTotals({
          matches: totalMatches,
          players: totalPlayers,
          matchResults: totalMatches,
          rounds: 0, // You can compute this if you have round data
        });
        setAvgMatchTime(avgMatchTime);

        // --- Top Players Calculation ---
        // Aggregate player stats
        const playerStats: Record<string, { wins: number; games: number; rating: number }> = {};
        games.forEach((game: any) => {
          if (Array.isArray(game.results)) {
            // Find the highest rating in this game (winner)
            let winner = null;
            let maxRating = -Infinity;
            game.results.forEach((result: any) => {
              if (!playerStats[result.player]) {
                playerStats[result.player] = { wins: 0, games: 0, rating: 0 };
              }
              playerStats[result.player].games += 1;
              playerStats[result.player].rating = result.rating;
              if (result.rating > maxRating) {
                maxRating = result.rating;
                winner = result.player;
              }
            });
            if (winner) {
              playerStats[winner].wins += 1;
            }
          }
        });
        // Convert to array
        let playersArr = Object.entries(playerStats).map(([name, stats]) => ({ name, ...stats }));
        // Sort by selected sort
        if (topPlayersSort === 'wins') {
          playersArr = playersArr.sort((a, b) => b.wins - a.wins);
        } else if (topPlayersSort === 'rating') {
          playersArr = playersArr.sort((a, b) => b.rating - a.rating);
        } else if (topPlayersSort === 'games') {
          playersArr = playersArr.sort((a, b) => b.games - a.games);
        }
        setTopPlayersData(playersArr);

        // You can also extract top players, illuvials, augments, etc. as needed

        // --- DAU (Daily Active Users) ---
        const dauMap: Record<string, Set<string>> = {};
        games.forEach((game: any) => {
          const day = new Date(game.startTime).toISOString().slice(0, 10); // YYYY-MM-DD
          if (!dauMap[day]) dauMap[day] = new Set();
          if (Array.isArray(game.players)) {
            game.players.forEach((p: string) => dauMap[day].add(p));
          }
        });
        const dauData = Object.entries(dauMap).map(([date, players]) => ({ date, users: players.size }));
        setDauData(dauData);

        // --- MAU (Monthly Active Users) ---
        const mauSet = new Set<string>();
        games.forEach((game: any) => {
          if (Array.isArray(game.players)) {
            game.players.forEach((p: string) => mauSet.add(p));
          }
        });
        setMauData([{ month: 'This Month', users: mauSet.size }]);

        // --- Player Activity (Top 20) ---
        const playerGameCounts: Record<string, number> = {};
        games.forEach((game: any) => {
          if (Array.isArray(game.players)) {
            game.players.forEach((p: string) => {
              playerGameCounts[p] = (playerGameCounts[p] || 0) + 1;
            });
          }
        });
        const playerActivity = Object.entries(playerGameCounts)
          .map(([playerId, count]) => ({ playerId, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);
        setPlayerActivity(playerActivity);

        // --- Matches Played (by Day) ---
        const matchesByDay: Record<string, number> = {};
        games.forEach((game: any) => {
          const day = new Date(game.startTime).toISOString().slice(0, 10);
          matchesByDay[day] = (matchesByDay[day] || 0) + 1;
        });
        const matchesPlayed = Object.entries(matchesByDay)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));
        setMatchesPlayed(matchesPlayed);

        setLoading(false);
      })
      .catch(error => {
        console.error('API fetch error:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
        setLoading(false);
      });
  }, [startDate, endDate]);

  const handlePlayerSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    const playerRef = doc(db, 'players', searchQuery.trim());
    const playerSnap = await getDoc(playerRef);
    if (playerSnap.exists()) {
      setPlayerData(playerSnap.data());
    } else {
      setPlayerData(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-700/50 backdrop-blur-sm"
      >
        Back
      </button>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
      </div>
      {loading ? (
        <div>Loading data...</div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-1">Total Matches</span>
            <span className="text-4xl font-extrabold">{totals.matches}</span>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-1">Total Players</span>
            <span className="text-4xl font-extrabold">{totals.players}</span>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-1">Average Match Time</span>
            <span className="text-4xl font-extrabold">{avgMatchTime} <span className="text-lg font-normal">sec</span></span>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-1">Total Match Results</span>
            <span className="text-4xl font-extrabold">{totals.matchResults}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Daily Active Users (DAU)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dauData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fill: '#fff', fontSize: 12 }} />
                <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Monthly Active Users (MAU)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mauData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: '#fff', fontSize: 12 }} />
                <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="users" fill="#82ca9d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Player Activity (Top 20)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={playerActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="playerId" tick={{ fill: '#fff', fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#ffc658" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Matches Played (by Day)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={matchesPlayed} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fill: '#fff', fontSize: 12 }} />
                <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={3} dot={false} />
                <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Top Players (Top 100)</h2>
            <div className="flex gap-2 mb-4">
              {[
                { label: 'Most Wins', value: 'wins' },
                { label: 'Highest Rating', value: 'rating' },
                { label: 'Most Games', value: 'games' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTopPlayersSort(opt.value as 'wins' | 'rating' | 'games')}
                  className={`px-3 py-1 rounded-full text-sm font-bold ${topPlayersSort === opt.value ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {topPlayersData.slice(0, 100).map((player, idx) => (
                <div key={player.name || idx} className="flex items-center gap-4">
                  <span className="text-lg font-bold text-yellow-400">#{idx + 1}</span>
                  <span className="text-white font-bold">{player.name}</span>
                  <span className="text-gray-400">Wins: {player.wins}</span>
                  <span className="text-gray-400">Rating: {player.rating}</span>
                  <span className="text-gray-400">Games: {player.games}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Top Illuvials</h2>
            <div className="flex gap-2 mb-4">
              {[{ label: 'All Tiers', value: 'All' }, { label: 'Tier 1', value: 1 }, { label: 'Tier 2', value: 2 }, { label: 'Tier 3', value: 3 }, { label: 'Tier 4', value: 4 }, { label: 'Tier 5', value: 5 }].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setIlluvialTierFilter(value as 'All' | 1 | 2 | 3 | 4 | 5)}
                  className={`px-3 py-1 rounded-full text-sm font-bold ${illuvialTierFilter === value ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {topIlluvials
                .filter(illuvial => illuvialTierFilter === 'All' || getIlluvialTier(illuvial.name, topIlluvials) === illuvialTierFilter)
                .map((illuvial, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-yellow-400">#{index + 1}</span>
                    <img src={getIlluvialImageUrl(illuvial)} alt={illuvial.name} className="w-12 h-12 rounded-full bg-gray-800 object-contain" onError={e => (e.currentTarget.src = '/image.png')} />
                    <span className="text-white font-bold">{illuvial.name}</span>
                    <span className="text-gray-400">{illuvial.usage || illuvial.picks || illuvial.count || '-'}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Top Augments</h2>
            <div className="flex gap-2 mb-4">
              {['All', 'Synergy', 'Legendary', 'Imprint'].map(type => (
                <button
                  key={type}
                  onClick={() => setAugmentTypeFilter(type)}
                  className={`px-3 py-1 rounded-full text-sm font-bold ${augmentTypeFilter === type ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {topAugments
                .filter(augment => augmentTypeFilter === 'All' || getAugmentType(augment.name, topAugments) === augmentTypeFilter)
                .map((augment, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-yellow-400">#{index + 1}</span>
                    <img src={getAugmentImageUrl(augment.name)} alt={augment.name} className="w-12 h-12 rounded-full bg-gray-800 object-contain" onError={e => (e.currentTarget.src = '/image.png')} />
                    <span className="text-white font-bold">{augment.name}</span>
                    <span className="text-gray-400">{augment.usage || augment.picks || augment.count || '-'}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg mt-8">
          <h2 className="text-xl font-bold mb-4">Player Search</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-400"
              placeholder="Enter player name or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handlePlayerSearch(); }}
            />
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
              onClick={handlePlayerSearch}
            >
              Search
            </button>
          </div>
          {playerData && (
            <div className="bg-gray-800 rounded-xl p-4 mt-4">
              <div className="font-bold text-lg mb-2">{playerData.name || playerData.id}</div>
              <div className="text-gray-400">Rating: {playerData.rating || '-'}</div>
              <div className="text-gray-400">Matches: {playerData.matches || playerData.count || '-'}</div>
              {/* Add more player stats here as needed */}
            </div>
          )}
          {playerData === null && searchQuery && (
            <div className="text-red-400 mt-2">No player found with that name or ID.</div>
          )}
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg mt-8">
          <h2 className="text-xl font-bold mb-4">Date Range</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Start Date:</label>
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">End Date:</label>
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage; 