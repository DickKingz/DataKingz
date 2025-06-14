import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Trophy, Calendar, MapPin, DollarSign, Clock, Settings, UserPlus, Eye, X, Edit2 } from 'lucide-react';
import { Tournament, TournamentParticipant, BracketMatch } from '../types';
import { db } from '../data/firebase';
import { collection, addDoc, onSnapshot, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Papa from 'papaparse';
import TournamentSeeding from './TournamentSeeding';
import TournamentBracket from './TournamentBracket';
import GauntletAdminView from './GauntletAdminView';
import GauntletPlayerView from './GauntletPlayerView';
import { getMatchByLobbyCode, getMatchesForPlayer, Match } from '../data/matchApi';

interface TournamentViewProps {
  tournamentId: string;
  onBack: () => void;
}

const TournamentView: React.FC<TournamentViewProps> = ({ tournamentId, onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'bracket' | 'rules'>('overview');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
  const [unregistering, setUnregistering] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<Partial<Tournament>>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [eliminatingId, setEliminatingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [removingBulk, setRemovingBulk] = useState(false);
  const [addingBulk, setAddingBulk] = useState(false);
  const [lobbyCodeInput, setLobbyCodeInput] = useState('');
  const [lobbyMatch, setLobbyMatch] = useState<Match | null>(null);
  const [myMatches, setMyMatches] = useState<Match[]>([]);
  const [loadingLobby, setLoadingLobby] = useState(false);
  const [loadingMyMatches, setLoadingMyMatches] = useState(false);

  // Fetch tournament data
  useEffect(() => {
    const fetchTournament = async () => {
      const tRef = doc(db, 'tournaments', tournamentId);
      const tSnap = await getDoc(tRef);
      if (tSnap.exists()) {
        setTournament({ id: tSnap.id, ...tSnap.data() } as Tournament);
        setEditData({ id: tSnap.id, ...tSnap.data() } as Tournament);
      }
    };
    fetchTournament();
  }, [tournamentId]);

  // Listen to participants in Firestore
  useEffect(() => {
    const participantsRef = collection(db, 'tournaments', tournamentId, 'participants');
    const unsub = onSnapshot(participantsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TournamentParticipant[];
      setParticipants(data);
    });
    return () => unsub();
  }, [tournamentId]);

  // Registration handler
  const handleRegistration = async () => {
    if (!user) {
      alert('You must be logged in to register.');
      return;
    }
    try {
      // Prevent duplicate registration
      const participantsRef = collection(db, 'tournaments', tournamentId, 'participants');
      const q = query(participantsRef, where('illuviumPlayerId', '==', user.playerId));
      const existing = await getDocs(q);
      if (!existing.empty) {
        alert('You are already registered for this tournament.');
        return;
      }
      await addDoc(participantsRef, {
        rangerName: user.nickname,
        illuviumPlayerId: user.playerId,
        registrationTime: new Date().toISOString(),
        status: 'registered'
      });
      setShowRegistrationModal(false);
      alert('Registration successful!');
    } catch (err) {
      alert('Failed to register.');
      console.error(err);
    }
  };

  // Unregister handler
  const handleUnregister = async () => {
    if (!user) return;
    setUnregistering(true);
    try {
      const participantsRef = collection(db, 'tournaments', tournamentId, 'participants');
      const q = query(participantsRef, where('illuviumPlayerId', '==', user.playerId));
      const existing = await getDocs(q);
      if (!existing.empty) {
        await Promise.all(existing.docs.map(d => deleteDoc(d.ref)));
        alert('You have been unregistered.');
      }
    } catch (err) {
      alert('Failed to unregister.');
      console.error(err);
    }
    setUnregistering(false);
  };

  // Admin remove participant
  const handleRemoveParticipant = async (participantId: string) => {
    setRemovingId(participantId);
    try {
      const participantDoc = doc(db, 'tournaments', tournamentId, 'participants', participantId);
      await deleteDoc(participantDoc);
      alert('Participant removed.');
    } catch (err) {
      alert('Failed to remove participant.');
      console.error(err);
    }
    setRemovingId(null);
  };

  // Check if user is registered
  const isRegistered = user && participants.some(p => p.illuviumPlayerId === user.playerId);

  // Admin: Save tournament edits
  const handleSaveEdit = async () => {
    if (!tournament) return;
    setSavingEdit(true);
    try {
      const tRef = doc(db, 'tournaments', tournamentId);
      await updateDoc(tRef, {
        name: editData.name,
        description: editData.description,
        registrationStart: editData.registrationStart,
        registrationEnd: editData.registrationEnd,
        startTime: editData.startTime,
        rules: editData.rules,
        status: editData.status,
        prizePool: editData.prizePool,
        hostPlatform: editData.hostPlatform,
        maxParticipants: editData.maxParticipants,
        // Add more fields as needed
      });
      setShowEditModal(false);
      setTournament({ ...tournament, ...editData } as Tournament);
      alert('Tournament updated!');
    } catch (err) {
      alert('Failed to update tournament.');
      console.error(err);
    }
    setSavingEdit(false);
  };

  // Admin: Open edit modal
  const openEditModal = () => {
    setEditData(tournament!);
    setShowEditModal(true);
  };

  // Admin: Status change
  const handleStatusChange = (newStatus: Tournament['status']) => {
    setEditData(prev => ({ ...prev, status: newStatus }));
  };

  // Admin: Check-in participant
  const handleCheckIn = async (participantId: string) => {
    setCheckingInId(participantId);
    try {
      const participantDoc = doc(db, 'tournaments', tournamentId, 'participants', participantId);
      await updateDoc(participantDoc, { status: 'checked-in' });
    } catch (err) {
      alert('Failed to check in participant.');
      console.error(err);
    }
    setCheckingInId(null);
  };

  // Admin: Disqualify/Eliminate participant
  const handleEliminate = async (participantId: string) => {
    setEliminatingId(participantId);
    try {
      const participantDoc = doc(db, 'tournaments', tournamentId, 'participants', participantId);
      await updateDoc(participantDoc, { status: 'eliminated' });
    } catch (err) {
      alert('Failed to eliminate participant.');
      console.error(err);
    }
    setEliminatingId(null);
  };

  // Admin: Approve participant
  const handleApprove = async (participantId: string) => {
    setApprovingId(participantId);
    try {
      const participantDoc = doc(db, 'tournaments', tournamentId, 'participants', participantId);
      await updateDoc(participantDoc, { status: 'registered' });
    } catch (err) {
      alert('Failed to approve participant.');
      console.error(err);
    }
    setApprovingId(null);
  };

  // Admin: Reject participant
  const handleReject = async (participantId: string) => {
    setRejectingId(participantId);
    try {
      const participantDoc = doc(db, 'tournaments', tournamentId, 'participants', participantId);
      await updateDoc(participantDoc, { status: 'rejected' });
    } catch (err) {
      alert('Failed to reject participant.');
      console.error(err);
    }
    setRejectingId(null);
  };

  // Bulk add participants from CSV
  const handleBulkAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddingBulk(true);
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const rows = results.data as any[];
        const batch = rows.filter(row => row.rangerName && row.illuviumPlayerId);
        try {
          for (const row of batch) {
            await addDoc(collection(db, 'tournaments', tournamentId, 'participants'), {
              rangerName: row.rangerName,
              illuviumPlayerId: row.illuviumPlayerId,
              registrationTime: new Date().toISOString(),
              status: 'registered',
            });
          }
          alert('Bulk add complete!');
        } catch (err) {
          alert('Bulk add failed.');
          console.error(err);
        }
        setAddingBulk(false);
      },
      error: (err) => {
        alert('CSV parse error.');
        setAddingBulk(false);
      }
    });
  };

  // Bulk remove selected participants
  const handleBulkRemove = async () => {
    if (selectedIds.length === 0) return;
    setRemovingBulk(true);
    try {
      for (const id of selectedIds) {
        await deleteDoc(doc(db, 'tournaments', tournamentId, 'participants', id));
      }
      setSelectedIds([]);
      alert('Selected participants removed.');
    } catch (err) {
      alert('Bulk remove failed.');
      console.error(err);
    }
    setRemovingBulk(false);
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Select all
  const selectAll = () => {
    setSelectedIds(participants.map(p => p.id));
  };

  // Deselect all
  const deselectAll = () => {
    setSelectedIds([]);
  };

  // Mock tournament data - in real app this would be fetched based on tournamentId
  const mockTournament: Tournament = {
    id: tournamentId,
    name: 'Illuvium Championship Series #1',
    description: 'Official championship tournament with exclusive NFT rewards and massive prize pool. This is the premier tournament for competitive Illuvium players.',
    organizer: 'Illuvium Official',
    status: 'registration',
    type: 'standard',
    format: 'single-elimination',
    maxParticipants: 128,
    currentParticipants: 87,
    prizePool: '10,000 ILV + Exclusive NFTs',
    registrationStart: '2024-01-20T10:00:00Z',
    registrationEnd: '2024-01-25T18:00:00Z',
    startTime: '2024-01-26T19:00:00Z',
    rounds: [
      { roundNumber: 1, name: 'Round of 128', format: 'bo1', startTime: '2024-01-26T19:00:00Z', advancingPlayers: 64, status: 'pending' },
      { roundNumber: 2, name: 'Round of 64', format: 'bo1', startTime: '2024-01-26T20:30:00Z', advancingPlayers: 32, status: 'pending' },
      { roundNumber: 3, name: 'Round of 32', format: 'bo3', startTime: '2024-01-26T22:00:00Z', advancingPlayers: 16, status: 'pending' },
      { roundNumber: 4, name: 'Round of 16', format: 'bo3', startTime: '2024-01-27T19:00:00Z', advancingPlayers: 8, status: 'pending' },
      { roundNumber: 5, name: 'Quarterfinals', format: 'bo3', startTime: '2024-01-27T21:00:00Z', advancingPlayers: 4, status: 'pending' },
      { roundNumber: 6, name: 'Semifinals', format: 'bo5', startTime: '2024-01-27T23:00:00Z', advancingPlayers: 2, status: 'pending' },
      { roundNumber: 7, name: 'Grand Finals', format: 'bo5', startTime: '2024-01-28T19:00:00Z', advancingPlayers: 1, status: 'pending' }
    ],
    rules: `Standard Illuvium Gauntlet rules apply. No coaching allowed during matches. Players must check in 15 minutes before their scheduled match time. Disconnections: 5-minute grace period for reconnection. All disputes will be resolved by tournament organizers. Stream sniping is strictly prohibited.`,
    hostPlatform: 'Illuvium Arena + Twitch',
    participants: [
      { id: '1', rangerName: 'TFTMaster', illuviumPlayerId: 'TFT123', registrationTime: '2024-01-20T12:00:00Z', status: 'registered' },
      { id: '2', rangerName: 'StrategyKing', illuviumPlayerId: 'SK456', registrationTime: '2024-01-20T13:30:00Z', status: 'registered' },
      { id: '3', rangerName: 'MetaBreaker', illuviumPlayerId: 'MB789', registrationTime: '2024-01-20T14:15:00Z', status: 'registered' }
    ]
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'registration': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'live': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'completed': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  // Helper function to generate bracket
  const generateBracket = (participants: TournamentParticipant[]): TournamentBracket => {
    // Ensure even number of participants
    const numParticipants = Math.pow(2, Math.ceil(Math.log2(participants.length)));
    const paddedParticipants = [...participants];
    while (paddedParticipants.length < numParticipants) {
      paddedParticipants.push(undefined as any);
    }

    // Calculate number of rounds
    const numRounds = Math.log2(numParticipants);
    
    // Generate first round matches
    const firstRoundMatches = [];
    for (let i = 0; i < numParticipants; i += 2) {
      const match: BracketMatch = {
        id: `match-1-${i/2}`,
        status: 'pending',
        player1: paddedParticipants[i] || undefined,
        player2: paddedParticipants[i + 1] || undefined
      };
      firstRoundMatches.push(match);
    }

    // Create rounds array
    const rounds = [{
      roundNumber: 1,
      matches: firstRoundMatches
    }];

    // Generate subsequent rounds
    for (let round = 2; round <= numRounds; round++) {
      const prevRound = rounds[round - 2];
      const numMatches = prevRound.matches.length / 2;
      const matches = [];

      for (let i = 0; i < numMatches; i++) {
        const match: BracketMatch = {
          id: `match-${round}-${i}`,
          status: 'pending'
        };
        matches.push(match);
      }

      rounds.push({
        roundNumber: round,
        matches
      });
    }

    return { rounds };
  };

  // Determine if user is admin
  const isAdmin = user?.adminLevel === 'master' || user?.adminLevel === 'tournament';

  // Find the current user's participant record
  const currentParticipant = user ? participants.find(p => p.illuviumPlayerId === user.playerId) : undefined;

  // Helper to safely get a valid status string
  const getSafeStatus = (status: string | null | undefined): 'upcoming' | 'registration' | 'live' | 'completed' => {
    if (!status) return 'upcoming';
    if (status === 'upcoming' || status === 'registration' || status === 'live' || status === 'completed') {
      return status;
    }
    return 'upcoming';
  };

  // Handler to join lobby by code
  const handleJoinLobby = async () => {
    if (!tournament) return;
    setLoadingLobby(true);
    const match = await getMatchByLobbyCode(tournament.id, lobbyCodeInput.trim().toUpperCase());
    setLobbyMatch(match);
    setLoadingLobby(false);
  };

  // Handler to fetch my matches
  const handleFetchMyMatches = async () => {
    if (!tournament || !user) return;
    setLoadingMyMatches(true);
    const matches = await getMatchesForPlayer(tournament.id, user.playerId);
    setMyMatches(matches);
    setLoadingMyMatches(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl border border-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tournaments
        </button>
        {/* Admin Edit Button */}
        {user?.adminLevel && (
          <button
            onClick={openEditModal}
            className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500/30 border border-yellow-500/30 ml-4"
          >
            <Edit2 className="w-5 h-5" />
            Edit
          </button>
        )}
      </div>

      {/* Tournament Status Dropdown for Admins */}
      {user?.adminLevel && tournament && (
        <div className="mb-6">
          <label className="block text-gray-300 font-medium mb-2">Status</label>
          <select
            value={editData.status || tournament.status}
            onChange={e => handleStatusChange(e.target.value as Tournament['status'])}
            className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="upcoming">Upcoming</option>
            <option value="registration">Registration</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={handleSaveEdit}
            className="ml-4 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-semibold"
            disabled={savingEdit}
          >
            {savingEdit ? 'Saving...' : 'Save Status'}
          </button>
        </div>
      )}

      {/* Edit Tournament Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 max-w-lg w-full mx-4">
            <h3 className="text-white text-xl font-bold mb-6">Edit Tournament</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-2">Description</label>
                <textarea
                  value={editData.description || ''}
                  onChange={e => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 h-24 resize-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-2">Rules</label>
                <textarea
                  value={editData.rules || ''}
                  onChange={e => setEditData(prev => ({ ...prev, rules: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 h-24 resize-none"
                />
              </div>
              {/* Add more fields as needed */}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-3 rounded-lg font-medium transition-colors"
                disabled={savingEdit}
              >
                {savingEdit ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Header */}
      <div className="bg-gradient-to-br from-purple-600/90 to-blue-700/90 rounded-2xl p-8 border border-purple-500/30 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-white text-4xl font-bold">{tournament?.name}</h1>
              <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(getSafeStatus(tournament?.status))}`}>
                {getSafeStatus(tournament?.status).toUpperCase()}
              </span>
            </div>
            <p className="text-purple-200 text-lg mb-4">{tournament?.description}</p>
            <div className="text-purple-200">
              Organized by <span className="font-semibold text-white">{tournament?.organizer}</span>
            </div>
          </div>
          
          {getSafeStatus(tournament?.status) === 'registration' && (
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Register Now
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Participants</span>
            </div>
            <div className="text-white text-2xl font-bold">{tournament?.currentParticipants}/{tournament?.maxParticipants}</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Prize Pool</span>
            </div>
            <div className="text-white text-lg font-bold">{tournament?.prizePool}</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Start Time</span>
            </div>
            <div className="text-white text-sm font-medium">{formatDate(tournament?.startTime ?? null)}</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Platform</span>
            </div>
            <div className="text-white text-sm font-medium">{tournament?.hostPlatform}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-8 mb-8">
        {[
          { key: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
          { key: 'participants', label: 'Participants', icon: <Users className="w-4 h-4" /> },
          { key: 'bracket', label: 'Bracket', icon: <Trophy className="w-4 h-4" /> },
          { key: 'rules', label: 'Rules', icon: <Settings className="w-4 h-4" /> }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 pb-3 font-semibold text-lg transition-all duration-300 ${
              activeTab === key
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Tournament Schedule */}
            <div>
              <h3 className="text-white text-xl font-bold mb-6">Tournament Schedule</h3>
              <div className="space-y-4">
                {tournament?.rounds.map((round, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">{round.roundNumber}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{round.name}</h4>
                          <p className="text-gray-400 text-sm">{formatDate(round.startTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-gray-400 text-sm">Format</div>
                          <div className="text-white font-medium">{round.format.toUpperCase()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400 text-sm">Advancing</div>
                          <div className="text-white font-medium">{round.advancingPlayers}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Info */}
            {tournament && getSafeStatus(tournament.status) === 'registration' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-400 text-xl font-bold">Registration Open</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <span className="font-medium">Registration Ends:</span>
                    <div className="text-white">{formatDate(String(tournament.registrationEnd || ''))}</div>
                  </div>
                  <div>
                    <span className="font-medium">Spots Remaining:</span>
                    <div className="text-white">{(tournament.maxParticipants ?? 0) - (tournament.currentParticipants ?? 0)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'participants' && (
          <div>
            <h3 className="text-white text-xl font-bold mb-6">
              Registered Participants ({participants.length})
            </h3>
            {/* Bulk Add/Remove Controls for Admins */}
            {user?.adminLevel && (
              <div className="flex items-center gap-4 mb-4">
                <label className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer">
                  {addingBulk ? 'Adding...' : 'Bulk Add (CSV)'}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleBulkAdd}
                    className="hidden"
                    disabled={addingBulk}
                  />
                </label>
                <button
                  onClick={selectAll}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Deselect All
                </button>
                <button
                  onClick={handleBulkRemove}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
                  disabled={removingBulk || selectedIds.length === 0}
                >
                  {removingBulk ? 'Removing...' : `Remove Selected (${selectedIds.length})`}
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {participants.map((participant, index) => (
                <div key={participant.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
                  <div>
                    {/* Checkbox for bulk select */}
                    {user?.adminLevel && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(participant.id)}
                        onChange={() => toggleSelect(participant.id)}
                        className="mr-2 accent-blue-500"
                      />
                    )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{participant.rangerName}</div>
                      <div className="text-gray-400 text-sm">{participant.illuviumPlayerId}</div>
                    </div>
                  </div>
                    <div className="text-gray-400 text-xs mb-2">
                    Registered: {new Date(participant.registrationTime).toLocaleDateString()}
                    </div>
                    <div className="text-xs">
                      Status: <span className="font-bold text-white">{participant.status}</span>
                    </div>
                  </div>
                  {user?.adminLevel && (
                    <div className="flex flex-col gap-2 items-end">
                      {/* Approve/Reject for pending participants */}
                      {participant.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(participant.id)}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold"
                            disabled={approvingId === participant.id}
                          >
                            {approvingId === participant.id ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(participant.id)}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold"
                            disabled={rejectingId === participant.id}
                          >
                            {rejectingId === participant.id ? 'Rejecting...' : 'Reject'}
                          </button>
                        </>
                      )}
                      {/* Existing check-in/eliminate controls */}
                      {participant.status !== 'checked-in' && participant.status !== 'pending' && participant.status !== 'rejected' && (
                        <button
                          onClick={() => handleCheckIn(participant.id)}
                          className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold"
                          disabled={checkingInId === participant.id}
                        >
                          {checkingInId === participant.id ? 'Checking in...' : 'Check-in'}
                        </button>
                      )}
                      {participant.status !== 'eliminated' && participant.status !== 'pending' && participant.status !== 'rejected' && (
                        <button
                          onClick={() => handleEliminate(participant.id)}
                          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold"
                          disabled={eliminatingId === participant.id}
                        >
                          {eliminatingId === participant.id ? 'Eliminating...' : 'Eliminate'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bracket' && (
          <div>
            {!tournament?.bracket ? (
              <TournamentSeeding
                participants={participants.filter(p => p.status === 'registered')}
                onSeedingComplete={async (seededParticipants) => {
                  if (!tournament) return;
                  
                  // Generate bracket based on seeded participants
                  const bracket = generateBracket(seededParticipants);
                  
                  // Update tournament with new bracket
                  const tRef = doc(db, 'tournaments', tournament.id);
                  await updateDoc(tRef, {
                    bracket
                  });
                }}
                isAdmin={user?.adminLevel === 'master' || user?.adminLevel === 'tournament'}
              />
            ) : (
              <TournamentBracket
                bracket={tournament.bracket}
                onSetWinner={async (matchId, winner) => {
                  if (!tournament?.bracket) return;
                  
                  // Find and update the match in the bracket
                  const updatedBracket = {
                    ...tournament.bracket,
                    rounds: tournament.bracket.rounds.map(round => ({
                      ...round,
                      matches: round.matches.map(match => 
                        match.id === matchId
                          ? { ...match, winner, status: 'completed' }
                          : match
                      )
                    }))
                  };
                  
                  // Update tournament with new bracket
                  const tRef = doc(db, 'tournaments', tournament.id);
                  await updateDoc(tRef, {
                    bracket: updatedBracket
                  });
                }}
                onRegenerateBracket={async () => {
                  if (!tournament) return;
                  
                  // Generate new bracket from registered participants
                  const registeredParticipants = participants.filter(p => p.status === 'registered');
                  const newBracket = generateBracket(registeredParticipants);
                  
                  // Update tournament with new bracket
                  const tRef = doc(db, 'tournaments', tournament.id);
                  await updateDoc(tRef, {
                    bracket: newBracket
                  });
                }}
                isAdmin={user?.adminLevel === 'master' || user?.adminLevel === 'tournament'}
              />
            )}
          </div>
        )}

        {activeTab === 'rules' && (
          <div>
            <h3 className="text-white text-xl font-bold mb-6">Tournament Rules</h3>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {tournament?.rules}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-bold mb-6">Register for Tournament</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Ranger Name</label>
                <input
                  type="text"
                  value={user.nickname}
                  readOnly
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-2">Illuvium Player ID</label>
                <input
                  type="text"
                  value={user.playerId}
                  readOnly
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRegistration}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gauntlet Admin View */}
      {tournament && tournament.type === 'gauntlet' && isAdmin && (
        <GauntletAdminView
          tournament={tournament}
          participants={participants}
          onAdvancePhase={(phaseId: string) => {
            // Implement phase advancement logic here
          }}
          onEditDivision={(divisionId: string) => {
            // Implement division edit logic here
          }}
          onEditPrize={(divisionId: string) => {
            // Implement prize edit logic here
          }}
        />
      )}
      {/* Gauntlet Player View */}
      {tournament && tournament.type === 'gauntlet' && !isAdmin && currentParticipant && (
        <GauntletPlayerView
          tournament={tournament}
          participant={currentParticipant}
          participants={participants}
        />
      )}

      {/* Lobby Join & My Matches UI */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-white text-lg font-bold mb-2">Join a Lobby by Code</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={lobbyCodeInput}
              onChange={e => setLobbyCodeInput(e.target.value)}
              placeholder="Enter Lobby Code"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={8}
            />
            <button
              onClick={handleJoinLobby}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold"
              disabled={loadingLobby || !lobbyCodeInput.trim()}
            >
              {loadingLobby ? 'Loading...' : 'Join'}
            </button>
          </div>
          {lobbyMatch && (
            <div className="mt-2 p-4 bg-gray-900 rounded-lg border border-purple-700">
              <div className="text-purple-300 font-bold mb-1">Lobby Code: {lobbyMatch.lobbyCode}</div>
              <div className="text-white mb-1">Status: <span className="font-semibold">{lobbyMatch.status}</span></div>
              <div className="text-gray-300 text-sm">Players:</div>
              <ul className="text-gray-200 text-sm ml-4">
                {lobbyMatch.players.map(pid => <li key={pid}>{pid}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-white text-lg font-bold mb-2">View My Matches</h3>
          <button
            onClick={handleFetchMyMatches}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold mb-2"
            disabled={loadingMyMatches || !user}
          >
            {loadingMyMatches ? 'Loading...' : 'Show My Matches'}
          </button>
          {myMatches.length > 0 && (
            <div className="space-y-2 mt-2">
              {myMatches.map(match => (
                <div key={match.id} className="p-3 bg-gray-900 rounded-lg border border-blue-700">
                  <div className="text-blue-300 font-bold mb-1">Lobby Code: {match.lobbyCode}</div>
                  <div className="text-white mb-1">Status: <span className="font-semibold">{match.status}</span></div>
                  <div className="text-gray-300 text-sm">Players:</div>
                  <ul className="text-gray-200 text-sm ml-4">
                    {match.players.map(pid => <li key={pid}>{pid}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentView;