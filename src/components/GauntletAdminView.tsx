import React, { useState, useEffect } from 'react';
import { Trophy, ChevronRight, Edit2 } from 'lucide-react';
import { Tournament, TournamentDivision, TournamentPhase, TournamentParticipant } from '../types';
import Papa from 'papaparse';
import { db } from '../data/firebase';
import { collection, doc, updateDoc, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface GauntletAdminViewProps {
  tournament: Tournament;
  participants: TournamentParticipant[];
  onAdvancePhase: (phaseId: string) => void;
  onEditDivision: (divisionId: string) => void;
  onEditPrize: (divisionId: string) => void;
}

type AuditLogEntry = {
  id?: string;
  action: string;
  user: string;
  timestamp?: { seconds: number; nanoseconds: number };
};

const GauntletAdminView: React.FC<GauntletAdminViewProps> = ({
  tournament,
  participants,
  onAdvancePhase,
  onEditDivision,
  onEditPrize,
}) => {
  const { user } = useAuth();
  // State for search and sorting
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'matches' | 'name'>('points');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  // State for match result entry
  const [resultSearch, setResultSearch] = useState('');
  const [editParticipantId, setEditParticipantId] = useState<string | null>(null);
  const [editPoints, setEditPoints] = useState<number>(0);
  const [editMatches, setEditMatches] = useState<number>(0);
  // Audit log state
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  // Fetch audit log in real time
  useEffect(() => {
    if (!tournament.id) return;
    const auditRef = collection(db, 'tournaments', tournament.id, 'auditLog');
    const unsub = onSnapshot(auditRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLogEntry));
      setAuditLog(data.sort((a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0)));
    });
    return () => unsub();
  }, [tournament.id]);

  // Handle phase advancement
  const handleAdvancePhase = async (phaseId: string) => {
    if (!tournament.id || !user) return;
    
    try {
      // Update tournament's current phase
      const tournamentRef = doc(db, 'tournaments', tournament.id);
      const currentPhaseIndex = tournament.phases?.findIndex(p => p.id === phaseId) ?? -1;
      const nextPhase = tournament.phases?.[currentPhaseIndex + 1];
      
      if (nextPhase) {
        await updateDoc(tournamentRef, {
          'phases': tournament.phases?.map(phase => 
            phase.id === phaseId 
              ? { ...phase, status: 'completed' }
              : phase.id === nextPhase.id
                ? { ...phase, status: 'live' }
                : phase
          )
        });

        // Add audit log entry
        const auditRef = collection(db, 'tournaments', tournament.id, 'auditLog');
        await addDoc(auditRef, {
          action: `Advanced tournament phase from ${tournament.phases?.[currentPhaseIndex].name} to ${nextPhase.name}`,
          user: user.nickname || user.email || 'admin',
          timestamp: Timestamp.now(),
        });

        // Call the original handler
        onAdvancePhase(phaseId);
      }
    } catch (error) {
      console.error('Failed to advance phase:', error);
      alert('Failed to advance phase. Please try again.');
    }
  };

  // Handle division edit
  const handleEditDivision = async (divisionId: string, updates: Partial<TournamentDivision>) => {
    if (!tournament.id || !user) return;
    
    try {
      // Update tournament's division
      const tournamentRef = doc(db, 'tournaments', tournament.id);
      await updateDoc(tournamentRef, {
        'divisions': tournament.divisions?.map(division => 
          division.id === divisionId 
            ? { ...division, ...updates }
            : division
        )
      });

      // Add audit log entry
      const auditRef = collection(db, 'tournaments', tournament.id, 'auditLog');
      await addDoc(auditRef, {
        action: `Edited division ${tournament.divisions?.find(d => d.id === divisionId)?.name || divisionId}`,
        user: user.nickname || user.email || 'admin',
        timestamp: Timestamp.now(),
      });

      // Call the original handler
      onEditDivision(divisionId);
    } catch (error) {
      console.error('Failed to edit division:', error);
      alert('Failed to edit division. Please try again.');
    }
  };

  // Handle prize edit
  const handleEditPrize = async (divisionId: string, updates: { prizePool: string }) => {
    if (!tournament.id || !user) return;
    
    try {
      // Update tournament's division prize
      const tournamentRef = doc(db, 'tournaments', tournament.id);
      await updateDoc(tournamentRef, {
        'divisions': tournament.divisions?.map(division => 
          division.id === divisionId 
            ? { ...division, prizePool: updates.prizePool }
            : division
        )
      });

      // Add audit log entry
      const auditRef = collection(db, 'tournaments', tournament.id, 'auditLog');
      await addDoc(auditRef, {
        action: `Updated prize pool for division ${tournament.divisions?.find(d => d.id === divisionId)?.name || divisionId} to ${updates.prizePool}`,
        user: user.nickname || user.email || 'admin',
        timestamp: Timestamp.now(),
      });

      // Call the original handler
      onEditPrize(divisionId);
    } catch (error) {
      console.error('Failed to edit prize:', error);
      alert('Failed to edit prize. Please try again.');
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Gauntlet Tournament Admin Panel
      </h2>

      {/* Divisions Overview */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-purple-300">Divisions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournament.divisions?.filter(division => typeof division.id === 'string' && division.id).map((division) => {
            // Filter, search, and sort participants for this division
            let divisionParticipants = participants.filter(p => p.divisionId === division.id);
            if (search) {
              divisionParticipants = divisionParticipants.filter(p =>
                p.rangerName.toLowerCase().includes(search.toLowerCase())
              );
            }
            divisionParticipants = [...divisionParticipants].sort((a, b) => {
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

            // Highlight ties in the leaderboard
            const ties: { [points: number]: TournamentParticipant[] } = {};
            divisionParticipants.forEach(p => {
              if (p.points !== undefined) {
                if (!ties[p.points]) ties[p.points] = [];
                ties[p.points].push(p);
              }
            });

            return (
              <div key={division.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-white">{division.name}</h4>
                  <button
                    onClick={() => handleEditDivision(division.id, { /* division updates */ })}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold"
                  >
                    Edit Division
                  </button>
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  ELO Range: {division.eloRange.min} - {division.eloRange.max}<br />
                  Expected Population: {division.expectedPopulation}<br />
                  Prize Pool: {division.prizePool} ILV
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => handleEditPrize(division.id, { prizePool: 'New Prize Pool' })}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs font-semibold"
                  >
                    Edit Prize
                  </button>
                </div>
                {/* Leaderboard for this division */}
                <div className="mt-4">
                  <h5 className="text-white font-semibold mb-2 text-sm">Leaderboard</h5>
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
                  <button
                    onClick={() => {
                      const csvData = divisionParticipants.map((p, idx) => ({
                        Rank: idx + 1,
                        Player: p.rangerName,
                        Points: p.points ?? 0,
                        Matches: p.matchesPlayed ?? 0,
                      }));
                      const csv = Papa.unparse(csvData);
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `${division.name}_leaderboard.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="mb-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white text-xs rounded-lg font-semibold"
                  >
                    Export CSV
                  </button>
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
                        {divisionParticipants.slice(0, 10).map((p, idx) => (
                          <tr key={p.id} className={
                            (idx === 0 ? 'text-yellow-300 font-bold ' : '') +
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
                </div>
                <div className="mt-4">
                  <h6 className="text-purple-300 font-semibold mb-1 text-xs">Prize Breakdown</h6>
                  <div className="bg-gray-900 rounded-lg p-2 border border-purple-700">
                    <div className="flex flex-col gap-1 text-xs text-gray-200">
                      <div className="flex justify-between font-bold text-purple-200">
                        <span>Total Pool</span>
                        <span>{division.prizePool} ILV</span>
                      </div>
                      {division.rewards?.map((reward, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>Place {reward.placement}</span>
                          <span>{reward.reward} ILV</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {tournament.tiebreakers && tournament.tiebreakers.length > 0 && (
                  <div className="mt-4">
                    <h6 className="text-purple-300 font-semibold mb-1 text-xs">Tiebreaker Rules</h6>
                    <ul className="list-disc list-inside text-xs text-gray-300">
                      {tournament.tiebreakers.map((tb, idx) => (
                        <li key={idx}><span className="font-semibold">{idx + 1}.</span> {tb.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {Object.values(ties).some(arr => arr.length > 1) && (
                  <div className="text-xs text-purple-300 mt-2">
                    <span className="font-semibold">Note:</span> Tied players are highlighted. Tiebreakers will be applied in the order listed above.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phases Overview */}
      <div className="space-y-4 mt-8">
        <h3 className="text-xl font-semibold text-purple-300">Phases</h3>
        <div className="space-y-4">
          {tournament.phases?.filter(phase => typeof phase.id === 'string' && phase.id).map((phase) => (
            <div key={phase.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">{phase.name}</div>
                <div className="text-gray-400 text-xs">
                  {phase.type} | {phase.format} | {phase.status}<br />
                  {phase.startTime && `Start: ${new Date(phase.startTime).toLocaleString()}`}<br />
                  {phase.endTime && `End: ${new Date(phase.endTime).toLocaleString()}`}
                </div>
              </div>
              <button
                onClick={() => handleAdvancePhase(phase.id)}
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold"
              >
                Advance Phase
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold text-purple-300 mb-2">Audit Log</h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <table className="w-full text-xs text-gray-300">
            <thead>
              <tr>
                <th className="text-left">Time</th>
                <th className="text-left">User</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.length === 0 ? (
                <tr><td colSpan={3} className="text-gray-500 text-center">No audit log entries yet.</td></tr>
              ) : (
                auditLog.map((log, idx) => (
                  <tr key={log.id || idx}>
                    <td>{log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleString() : ''}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="text-xs text-gray-500 mt-2">(This is a mock log. Connect to backend for real-time audit tracking.)</div>
        </div>
      </div>

      {/* Match Result Entry Panel */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-purple-300 mb-2">Match Result Entry</h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={resultSearch}
              onChange={e => setResultSearch(e.target.value)}
              placeholder="Search participant..."
              className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm"
            />
          </div>
          {resultSearch && (
            <div className="mb-4">
              {participants.filter(p => p.rangerName.toLowerCase().includes(resultSearch.toLowerCase())).slice(0, 5).map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setEditParticipantId(p.id);
                    setEditPoints(p.points ?? 0);
                    setEditMatches(p.matchesPlayed ?? 0);
                  }}
                  className="block w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-purple-700 text-white mb-1"
                >
                  {p.rangerName} (Points: {p.points ?? 0}, Matches: {p.matchesPlayed ?? 0})
                </button>
              ))}
            </div>
          )}
          {editParticipantId && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-gray-300 text-sm">Points</label>
                <input
                  type="number"
                  value={editPoints}
                  onChange={e => setEditPoints(Number(e.target.value))}
                  className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-700 text-sm w-24"
                />
                <label className="text-gray-300 text-sm">Matches</label>
                <input
                  type="number"
                  value={editMatches}
                  onChange={e => setEditMatches(Number(e.target.value))}
                  className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-700 text-sm w-24"
                />
                <button
                  onClick={async () => {
                    if (!editParticipantId || !tournament.id || !user) return;
                    const participantDoc = doc(db, 'tournaments', tournament.id, 'participants', editParticipantId);
                    await updateDoc(participantDoc, {
                      points: editPoints,
                      matchesPlayed: editMatches,
                    });
                    // Add audit log entry
                    const auditRef = collection(db, 'tournaments', tournament.id, 'auditLog');
                    await addDoc(auditRef, {
                      action: `Updated participant ${editParticipantId}: Points=${editPoints}, Matches=${editMatches}`,
                      user: user.nickname || user.email || 'admin',
                      timestamp: Timestamp.now(),
                    });
                    setEditParticipantId(null);
                    setResultSearch('');
                  }}
                  className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded-lg font-semibold ml-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditParticipantId(null)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg font-semibold ml-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GauntletAdminView; 