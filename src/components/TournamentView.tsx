import React, { useState } from 'react';
import { ArrowLeft, Users, Trophy, Calendar, MapPin, DollarSign, Clock, Settings, UserPlus, Eye } from 'lucide-react';
import { Tournament, TournamentParticipant } from '../types';

interface TournamentViewProps {
  tournamentId: string;
  onBack: () => void;
  onJoinTournament: (tournamentId: string) => void;
}

const TournamentView: React.FC<TournamentViewProps> = ({ tournamentId, onBack, onJoinTournament }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'bracket' | 'rules'>('overview');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    rangerName: '',
    illuviumPlayerId: ''
  });

  // Mock tournament data - in real app this would be fetched based on tournamentId
  const tournament: Tournament = {
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

  const formatDate = (dateString: string) => {
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

  const handleRegistration = () => {
    if (!registrationData.rangerName || !registrationData.illuviumPlayerId) {
      alert('Please fill in all fields');
      return;
    }
    
    onJoinTournament(tournamentId);
    setShowRegistrationModal(false);
    setRegistrationData({ rangerName: '', illuviumPlayerId: '' });
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
      </div>

      {/* Tournament Header */}
      <div className="bg-gradient-to-br from-purple-600/90 to-blue-700/90 rounded-2xl p-8 border border-purple-500/30 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-white text-4xl font-bold">{tournament.name}</h1>
              <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(tournament.status)}`}>
                {tournament.status.toUpperCase()}
              </span>
            </div>
            <p className="text-purple-200 text-lg mb-4">{tournament.description}</p>
            <div className="text-purple-200">
              Organized by <span className="font-semibold text-white">{tournament.organizer}</span>
            </div>
          </div>
          
          {tournament.status === 'registration' && (
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
            <div className="text-white text-2xl font-bold">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Prize Pool</span>
            </div>
            <div className="text-white text-lg font-bold">{tournament.prizePool}</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Start Time</span>
            </div>
            <div className="text-white text-sm font-medium">{formatDate(tournament.startTime)}</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Platform</span>
            </div>
            <div className="text-white text-sm font-medium">{tournament.hostPlatform}</div>
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
                {tournament.rounds.map((round, index) => (
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
            {tournament.status === 'registration' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-400 text-xl font-bold">Registration Open</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <span className="font-medium">Registration Ends:</span>
                    <div className="text-white">{formatDate(tournament.registrationEnd)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Spots Remaining:</span>
                    <div className="text-white">{tournament.maxParticipants - tournament.currentParticipants}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'participants' && (
          <div>
            <h3 className="text-white text-xl font-bold mb-6">
              Registered Participants ({tournament.currentParticipants}/{tournament.maxParticipants})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournament.participants.map((participant, index) => (
                <div key={participant.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{participant.rangerName}</div>
                      <div className="text-gray-400 text-sm">{participant.illuviumPlayerId}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs">
                    Registered: {new Date(participant.registrationTime).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bracket' && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400 text-lg mb-2">Bracket Coming Soon</div>
            <div className="text-gray-500 text-sm">
              The tournament bracket will be generated once registration closes
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div>
            <h3 className="text-white text-xl font-bold mb-6">Tournament Rules</h3>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {tournament.rules}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-bold mb-6">Register for Tournament</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Ranger Name</label>
                <input
                  type="text"
                  value={registrationData.rangerName}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, rangerName: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your ranger name"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">Illuvium Player ID</label>
                <input
                  type="text"
                  value={registrationData.illuviumPlayerId}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, illuviumPlayerId: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your Illuvium player ID"
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
    </div>
  );
};

export default TournamentView;