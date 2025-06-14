import React, { useState } from 'react';
import { Calendar, Users, Trophy, Clock, MapPin, DollarSign, Filter, Search, Plus, Trash2 } from 'lucide-react';
import { Tournament } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface TournamentListProps {
  tournaments: Tournament[];
  onCreateTournament: () => void;
  onJoinTournament: (tournamentId: string) => void;
  onViewTournament: (tournamentId: string) => void;
  onDeleteTournament: (tournamentId: string) => void;
}

const TournamentList: React.FC<TournamentListProps> = ({
  tournaments,
  onCreateTournament,
  onJoinTournament,
  onViewTournament,
  onDeleteTournament
}) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'registration' | 'live' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'standard' | 'custom' | 'practice'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const getStatusColor = (status: 'upcoming' | 'registration' | 'live' | 'completed') => {
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'registration': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'live': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'completed': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTypeColor = (type: 'standard' | 'custom' | 'practice' | 'gauntlet') => {
    switch (type) {
      case 'standard': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'custom': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'practice': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'gauntlet': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getSafeStatus = (status: string | null | undefined): 'upcoming' | 'registration' | 'live' | 'completed' => {
    if (!status) return 'upcoming';
    if (status === 'upcoming' || status === 'registration' || status === 'live' || status === 'completed') {
      return status;
    }
    return 'upcoming';
  };

  const getSafeType = (type: string | null | undefined): 'standard' | 'custom' | 'practice' | 'gauntlet' => {
    if (!type) return 'standard';
    if (type === 'standard' || type === 'custom' || type === 'practice' || type === 'gauntlet') {
      return type;
    }
    return 'standard';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteClick = (tournamentId: string) => {
    setShowDeleteConfirm(tournamentId);
  };

  const handleDeleteConfirm = (tournamentId: string) => {
    onDeleteTournament(tournamentId);
    setShowDeleteConfirm(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const safeStatus = getSafeStatus(tournament.status);
    const safeType = getSafeType(tournament.type);
    const matchesStatus = filter === 'all' || safeStatus === filter;
    const matchesType = typeFilter === 'all' || safeType === typeFilter;
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

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
        {/* Only show Create Tournament if user is master or tournament admin */}
        {user && (user.adminLevel === 'master' || user.adminLevel === 'tournament') && (
          <button
            onClick={onCreateTournament}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Create Tournament
          </button>
        )}
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
        {filteredTournaments.map((tournament) => {
          const safeStatus = getSafeStatus(tournament.status);
          const safeType = getSafeType(tournament.type);
          return (
            <div key={tournament.id} className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
              {/* Tournament Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white text-xl font-bold">{tournament.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(safeStatus)}`}>
                      {safeStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{tournament.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-300">by {tournament.organizer}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(safeType)}`}>
                      {safeType.toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* Only show Delete Tournament if user is master admin */}
                {user?.adminLevel === 'master' && (
                  <button
                    onClick={() => handleDeleteClick(tournament.id)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete Tournament"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
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
              {safeStatus === 'registration' && (
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
                
                {safeStatus === 'registration' && (
                  <button
                    onClick={() => onJoinTournament(tournament.id)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  >
                    Register
                  </button>
                )}
                
                {safeStatus === 'live' && (
                  <button
                    onClick={() => onViewTournament(tournament.id)}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Watch Live
                  </button>
                )}
              </div>

              {/* Delete Confirmation Modal */}
              {showDeleteConfirm === tournament.id && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 max-w-md w-full mx-4">
                    <h3 className="text-white text-xl font-bold mb-4">Delete Tournament</h3>
                    <p className="text-gray-300 mb-6">
                      Are you sure you want to delete "{tournament.name}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteCancel}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(tournament.id)}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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