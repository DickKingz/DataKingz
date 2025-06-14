import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Tournament, TournamentDivision, TournamentPhase, TournamentParticipant } from '../types';

interface GauntletPlayerViewProps {
  tournament: Tournament;
  participant: TournamentParticipant;
  participants: TournamentParticipant[];
}

const GauntletPlayerView: React.FC<GauntletPlayerViewProps> = ({
  tournament,
  participant,
  participants,
}) => {
  // Find division
  const division = tournament.divisions?.filter(d => typeof d.id === 'string' && d.id).find(d => d.id === participant.divisionId);
  // Find current phase
  const currentPhase = tournament.phases?.find(p => p.status === 'live') || tournament.phases?.[0];

  // State for search and sorting
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'matches' | 'name'>('points');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  // Leaderboard for this division
  let divisionLeaderboard = participants.filter(p => p.divisionId === division?.id);
  if (search) {
    divisionLeaderboard = divisionLeaderboard.filter(p =>
      p.rangerName.toLowerCase().includes(search.toLowerCase())
    );
  }
  divisionLeaderboard = [...divisionLeaderboard].sort((a, b) => {
    if (sortBy === 'points') {
      return sortDir === 'desc'
        ? (b.points ?? 0) - (a.points ?? 0)
        : (a.points ?? 0) - (b.points ?? 0);
    } else if (sortBy === 'matches') {
      return sortDir === 'desc'
        ? (b.matchesPlayed ?? 0) - (a.matchesPlayed ?? 0)
        : (a.matchesPlayed ?? 0) - (b.matchesPlayed ?? 0);
    } else {
      return sortDir === 'desc'
        ? b.rangerName.localeCompare(a.rangerName)
        : a.rangerName.localeCompare(b.rangerName);
    }
  });

  // Player's rank
  const playerRank = divisionLeaderboard.findIndex(p => p.id === participant.id) + 1;

  // After the prize breakdown for the player's division
  {division && tournament.tiebreakers && tournament.tiebreakers.length > 0 && (
    <div className="mt-4">
      <h6 className="text-purple-300 font-semibold mb-1 text-xs">Tiebreaker Rules</h6>
      <ul className="list-disc list-inside text-xs text-gray-300">
        {tournament.tiebreakers.map((tb, idx) => (
          <li key={idx}><span className="font-semibold">{idx + 1}.</span> {tb.description}</li>
        ))}
      </ul>
    </div>
  )}

  // Highlight ties in the leaderboard
  const ties: { [points: number]: TournamentParticipant[] } = {};
  divisionLeaderboard.forEach(p => {
    if (p.points !== undefined) {
      if (!ties[p.points]) ties[p.points] = [];
      ties[p.points].push(p);
    }
  });

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Gauntlet Tournament Player Dashboard
      </h2>

      {/* Player Division & Progress */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">Your Division</h3>
        {division ? (
          <div className="text-white">
            <div className="font-bold text-xl mb-1">{division.name}</div>
            <div className="text-gray-400 text-sm mb-2">ELO Range: {division.eloRange.min} - {division.eloRange.max}</div>
            <div className="flex gap-8 text-sm">
              <div>Points: <span className="font-bold text-green-400">{participant.points ?? 0}</span></div>
              <div>Matches Played: <span className="font-bold text-blue-400">{participant.matchesPlayed ?? 0}</span></div>
              <div>Rank: <span className="font-bold text-yellow-300">{playerRank > 0 ? playerRank : '-'}</span></div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">You are not assigned to a division yet.</div>
        )}
      </div>

      {/* Current Phase */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">Current Phase</h3>
        {currentPhase ? (
          <div className="text-white">
            <div className="font-bold text-lg mb-1">{currentPhase.name}</div>
            <div className="text-gray-400 text-sm mb-1">{currentPhase.type} | {currentPhase.format} | {currentPhase.status}</div>
            {currentPhase.startTime && <div className="text-gray-400 text-xs">Start: {new Date(currentPhase.startTime).toLocaleString()}</div>}
            {currentPhase.endTime && <div className="text-gray-400 text-xs">End: {new Date(currentPhase.endTime).toLocaleString()}</div>}
          </div>
        ) : (
          <div className="text-gray-400">No phase information available.</div>
        )}
      </div>

      {/* Division Leaderboard */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">Division Leaderboard</h3>
        {/* Search and sort controls */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search player..."
            className="bg-gray-900 text-white px-2 py-1 rounded border border-gray-700 text-xs"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-gray-900 text-white px-2 py-1 rounded border border-gray-700 text-xs"
          >
            <option value="points">Points</option>
            <option value="matches">Matches</option>
            <option value="name">Name</option>
          </select>
          <button
            onClick={() => setSortDir(d => (d === 'desc' ? 'asc' : 'desc'))}
            className="text-xs text-gray-400 hover:text-white"
            title="Toggle sort direction"
          >
            {sortDir === 'desc' ? '↓' : '↑'}
          </button>
        </div>
        <div className="bg-gray-900 rounded-lg p-2 border border-gray-700">
          <table className="w-full text-xs text-gray-300">
            <thead>
              <tr>
                <th className="text-left">#</th>
                <th className="text-left">Player</th>
                <th className="text-left">Points</th>
                <th className="text-left">Matches</th>
              </tr>
            </thead>
            <tbody>
              {divisionLeaderboard.slice(0, 10).map((p, idx) => (
                <tr key={p.id} className={
                  (p.id === participant.id ? 'text-yellow-300 font-bold ' : '') +
                  (ties[p.points ?? 0]?.length > 1 ? 'bg-purple-900/40' : '')
                }>
                  <td>{idx + 1}</td>
                  <td>{p.rangerName}</td>
                  <td>{p.points ?? 0}</td>
                  <td>{p.matchesPlayed ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* If there are any ties, show a note below the table */}
        {Object.values(ties).some(arr => arr.length > 1) && (
          <div className="text-xs text-purple-300 mt-2">
            <span className="font-semibold">Note:</span> Tied players are highlighted. Tiebreakers will be applied in the order listed above.
          </div>
        )}
      </div>
    </div>
  );
};

export default GauntletPlayerView; 