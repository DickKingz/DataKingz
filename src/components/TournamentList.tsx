import React, { useState } from 'react';
import { Calendar, Users, Trophy, Clock, MapPin, DollarSign, Filter, Search, Plus } from 'lucide-react';
import { Tournament } from '../types';

interface TournamentListProps {
  onCreateTournament: () => void;
  onJoinTournament: (tournamentId: string) => void;
  onViewTournament: (tournamentId: string) => void;
}

const TournamentList: React.FC<TournamentListProps> = ({ 
  onCreateTournament, 
  onJoinTournament, 
  onViewTournament 
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'registration' | 'live' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'standard' | 'custom' | 'practice'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock tournament data
  const tournaments: Tournament[] = [
    {
      id: '1',
      name: 'Illuvium Championship Series #1',
      description: 'Official championship tournament with exclusive NFT rewards',
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
        { roundNumber: 3, name: 'Round of 32', format: 'bo3', startTime: '2024-01-26T22:00:00Z', advancingPlayers: 16, status: 'pending' }
      ],
      rules: 'Standard Illuvium Gauntlet rules apply. No coaching allowed.',
      hostPlatform: 'Illuvium Arena',
      participants: [],
      bracket: undefined
    },
    {
      id: '2',
      name: 'Community Cup Weekly',
      description: 'Weekly community tournament for practice and fun',
      organizer: 'TFT_Master_Pro',
      status: 'live',
      type: 'custom',
      format: 'swiss',
      maxParticipants: 64,
      currentParticipants: 64,
      prizePool: '500 ILV',
      registrationStart: '2024-01-18T12:00:00Z',
      registrationEnd: '2024-01-20T12:00:00Z',
      startTime: '2024-01-20T15:00:00Z',
      rounds: [
        { roundNumber: 1, name: 'Swiss Round 1', format: 'bo1', startTime: '2024-01-20T15:00:00Z', advancingPlayers: 64, status: 'completed' },
        { roundNumber: 2, name: 'Swiss Round 2', format: 'bo1', startTime: '2024-01-20T16:00:00Z', advancingPlayers: 32, status: 'live' }
      ],
      rules: 'Swiss format, 4 rounds. Top 8 advance to playoffs.',
      hostPlatform: 'Discord + Illuvium Arena',
      participants: [],
      bracket: undefined
    },
    {
      id: '3',
      name: 'Beginner Practice Tournament',
      description: 'Perfect for new players to learn tournament format',
      organizer: 'Illuvium Academy',
      status: 'upcoming',
      type: 'practice',
      format: 'round-robin',
      maxParticipants: 32,
      currentParticipants: 18,
      prizePool: 'Learning Experience + Badges',
      registrationStart: '2024-01-22T08:00:00Z',
      registrationEnd: '2024-01-28T20:00:00Z',
      startTime: '2024-01-29T14:00:00Z',
      rounds: [
        { roundNumber: 1, name: 'Group Stage', format: 'bo1', startTime: '2024-01-29T14:00:00Z', advancingPlayers: 16, status: 'pending' }
      ],
      rules: 'Beginner-friendly rules. Coaching allowed.',
      hostPlatform: 'Illuvium Arena',
      participants: [],
      bracket: undefined
    },
    {
      id: '4',
      name: 'High Stakes Invitational',
      description: 'Invite-only tournament for top players',
      organizer: 'Illuvium Esports',
      status: 'completed',
      type: 'standard',
      format: 'double-elimination',
      maxParticipants: 16,
      currentParticipants: 16,
      prizePool: '25,000 ILV + Legendary NFTs',
      registrationStart: '2024-01-10T00:00:00Z',
      registrationEnd: '2024-01-15T23:59:59Z',
      startTime: '2024-01-16T18:00:00Z',
      endTime: '2024-01-16T23:30:00Z',
      rounds: [
        { roundNumber: 1, name: 'Winners Round 1', format: 'bo3', startTime: '2024-01-16T18:00:00Z', advancingPlayers: 8, status: 'completed' },
        { roundNumber: 2, name: 'Winners Round 2', format: 'bo3', startTime: '2024-01-16T20:00:00Z', advancingPlayers: 4, status: 'completed' },
        { roundNumber: 3, name: 'Grand Finals', format: 'bo5', startTime: '2024-01-16T22:00:00Z', advancingPlayers: 1, status: 'completed' }
      ],
      rules: 'Double elimination bracket. Grand finals reset if needed.',
      hostPlatform: 'Twitch + Illuvium Arena',
      participants: [],
      bracket: undefined
    }
  ];

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesStatus = filter === 'all' || tournament.status === filter;
    const matchesType = typeFilter === 'all' || tournament.type === typeFilter;
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tournament.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'registration': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'live': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'completed': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'custom': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'practice': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-3xl font-bold">Tournaments</h1>
            <p className="text-gray-400">Compete in official and community tournaments</p>
          </div>
        </div>

        <button
          onClick={onCreateTournament}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Create Tournament
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-6 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="registration">Registration Open</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Types</option>
          <option value="standard">Standard</option>
          <option value="custom">Custom</option>
          <option value="practice">Practice</option>
        </select>
      </div>

      {/* Tournament Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTournaments.map((tournament) => (
          <div key={tournament.id} className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
            {/* Tournament Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white text-xl font-bold">{tournament.name}</h3>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(tournament.status)}`}>
                    {tournament.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{tournament.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-300">by {tournament.organizer}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(tournament.type)}`}>
                    {tournament.type.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tournament Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-white font-medium">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
                  <div className="text-gray-400 text-sm">Participants</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-white font-medium">{tournament.prizePool}</div>
                  <div className="text-gray-400 text-sm">Prize Pool</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-white font-medium">{formatDate(tournament.startTime)}</div>
                  <div className="text-gray-400 text-sm">Start Time</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-white font-medium">{tournament.hostPlatform}</div>
                  <div className="text-gray-400 text-sm">Platform</div>
                </div>
              </div>
            </div>

            {/* Registration Info */}
            {tournament.status === 'registration' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Registration Open</span>
                </div>
                <div className="text-gray-300 text-sm">
                  Ends: {formatDate(tournament.registrationEnd)}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => onViewTournament(tournament.id)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View Details
              </button>
              
              {tournament.status === 'registration' && (
                <button
                  onClick={() => onJoinTournament(tournament.id)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Register
                </button>
              )}
              
              {tournament.status === 'live' && (
                <button
                  onClick={() => onViewTournament(tournament.id)}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Watch Live
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <div className="text-gray-400 text-lg mb-2">No tournaments found</div>
          <div className="text-gray-500 text-sm">Try adjusting your filters or create a new tournament</div>
        </div>
      )}
    </div>
  );
};

export default TournamentList;