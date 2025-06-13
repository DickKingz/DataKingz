import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Trophy, Clock, MapPin, DollarSign, Settings, Plus, X, AlertCircle } from 'lucide-react';
import { Tournament, TournamentRound } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface TournamentCreatorProps {
  onBack: () => void;
  onCreateTournament: (tournament: Partial<Tournament>) => void;
}

const TournamentCreator: React.FC<TournamentCreatorProps> = ({ onBack, onCreateTournament }) => {
  const { user, isAuthenticated } = useAuth();
  const [tournament, setTournament] = useState<Partial<Tournament>>({
    name: '',
    description: '',
    type: 'custom',
    format: 'single-elimination',
    maxParticipants: 32,
    prizePool: '',
    registrationStart: '',
    registrationEnd: '',
    startTime: '',
    rules: '',
    hostPlatform: 'Illuvium Arena',
    rounds: [
      { roundNumber: 1, name: 'Round 1', format: 'bo1', startTime: '', advancingPlayers: 16, status: 'pending' }
    ]
  });

  const [activeStep, setActiveStep] = useState(1);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl border border-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tournaments
          </button>
        </div>

        <div className="max-w-md mx-auto text-center py-12">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">
            You need to connect your wallet with IMX Passport to create tournaments. This ensures proper player identification for reward distribution.
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Go Back & Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  const updateTournament = (field: keyof Tournament, value: any) => {
    setTournament(prev => ({ ...prev, [field]: value }));
  };

  const addRound = () => {
    const newRound: TournamentRound = {
      roundNumber: (tournament.rounds?.length || 0) + 1,
      name: `Round ${(tournament.rounds?.length || 0) + 1}`,
      format: 'bo1',
      startTime: '',
      advancingPlayers: Math.floor((tournament.rounds?.[tournament.rounds.length - 1]?.advancingPlayers || 16) / 2),
      status: 'pending'
    };
    
    setTournament(prev => ({
      ...prev,
      rounds: [...(prev.rounds || []), newRound]
    }));
  };

  const updateRound = (index: number, field: keyof TournamentRound, value: any) => {
    setTournament(prev => ({
      ...prev,
      rounds: prev.rounds?.map((round, i) => 
        i === index ? { ...round, [field]: value } : round
      ) || []
    }));
  };

  const removeRound = (index: number) => {
    setTournament(prev => ({
      ...prev,
      rounds: prev.rounds?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!tournament.name || !tournament.startTime || !tournament.registrationEnd) {
      alert('Please fill in all required fields');
      return;
    }

    onCreateTournament({
      ...tournament,
      id: Date.now().toString(),
      organizer: user?.nickname || 'Tournament Organizer',
      status: 'upcoming',
      currentParticipants: 0,
      participants: []
    });
  };

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Tournament details' },
    { number: 2, title: 'Schedule', description: 'Timing & registration' },
    { number: 3, title: 'Format', description: 'Rounds & advancement' },
    { number: 4, title: 'Rules', description: 'Rules & platform' }
  ];

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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-3xl font-bold">Create Tournament</h1>
            <p className="text-gray-400">Organizer: {user?.nickname} (ID: {user?.playerId})</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Step Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 sticky top-8">
            <h3 className="text-white font-semibold mb-4">Setup Steps</h3>
            <div className="space-y-4">
              {steps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(step.number)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                    activeStep === step.number
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    activeStep === step.number ? 'bg-white text-purple-600' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {step.number}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className={`text-xs ${
                      activeStep === step.number ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
            >
              Create Tournament
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            {activeStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-white text-xl font-semibold">Basic Information</h3>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Tournament Name *</label>
                  <input
                    type="text"
                    value={tournament.name || ''}
                    onChange={(e) => updateTournament('name', e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter tournament name..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Description</label>
                  <textarea
                    value={tournament.description || ''}
                    onChange={(e) => updateTournament('description', e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                    placeholder="Describe your tournament..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Tournament Type</label>
                    <select
                      value={tournament.type || 'custom'}
                      onChange={(e) => updateTournament('type', e.target.value)}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="custom">Custom</option>
                      <option value="practice">Practice</option>
                      <option value="standard">Standard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Format</label>
                    <select
                      value={tournament.format || 'single-elimination'}
                      onChange={(e) => updateTournament('format', e.target.value)}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="single-elimination">Single Elimination</option>
                      <option value="double-elimination">Double Elimination</option>
                      <option value="swiss">Swiss</option>
                      <option value="round-robin">Round Robin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Max Participants</label>
                    <select
                      value={tournament.maxParticipants || 32}
                      onChange={(e) => updateTournament('maxParticipants', parseInt(e.target.value))}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={8}>8 Players</option>
                      <option value={16}>16 Players</option>
                      <option value={32}>32 Players</option>
                      <option value={64}>64 Players</option>
                      <option value={128}>128 Players</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Prize Pool</label>
                    <input
                      type="text"
                      value={tournament.prizePool || ''}
                      onChange={(e) => updateTournament('prizePool', e.target.value)}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 1000 ILV + NFTs"
                    />
                  </div>
                </div>

                {/* Player ID Info */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">Reward Distribution</span>
                  </div>
                  <div className="text-gray-300 text-sm">
                    Tournament rewards will be distributed using player IDs from IMX Passport. 
                    Your organizer ID: <span className="font-mono text-white">{user?.playerId}</span>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-white text-xl font-semibold">Schedule & Registration</h3>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Registration Start</label>
                  <input
                    type="datetime-local"
                    value={tournament.registrationStart || ''}
                    onChange={(e) => updateTournament('registrationStart', e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Registration End *</label>
                  <input
                    type="datetime-local"
                    value={tournament.registrationEnd || ''}
                    onChange={(e) => updateTournament('registrationEnd', e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Tournament Start Time *</label>
                  <input
                    type="datetime-local"
                    value={tournament.startTime || ''}
                    onChange={(e) => updateTournament('startTime', e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">Timing Tips</span>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Allow at least 30 minutes between registration end and tournament start</li>
                    <li>• Consider time zones for your target audience</li>
                    <li>• Weekend tournaments typically get more participants</li>
                  </ul>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-xl font-semibold">Tournament Rounds</h3>
                  <button
                    onClick={addRound}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Round
                  </button>
                </div>

                <div className="space-y-4">
                  {tournament.rounds?.map((round, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-semibold">Round {round.roundNumber}</h4>
                        {tournament.rounds!.length > 1 && (
                          <button
                            onClick={() => removeRound(index)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Round Name</label>
                          <input
                            type="text"
                            value={round.name}
                            onChange={(e) => updateRound(index, 'name', e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Format</label>
                          <select
                            value={round.format}
                            onChange={(e) => updateRound(index, 'format', e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="bo1">Best of 1</option>
                            <option value="bo3">Best of 3</option>
                            <option value="bo5">Best of 5</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Advancing Players</label>
                          <input
                            type="number"
                            value={round.advancingPlayers}
                            onChange={(e) => updateRound(index, 'advancingPlayers', parseInt(e.target.value))}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-white text-xl font-semibold">Rules & Platform</h3>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Host Platform</label>
                  <select
                    value={tournament.hostPlatform || 'Illuvium Arena'}
                    onChange={(e) => updateTournament('hostPlatform', e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Illuvium Arena">Illuvium Arena</option>
                    <option value="Discord + Illuvium Arena">Discord + Illuvium Arena</option>
                    <option value="Twitch + Illuvium Arena">Twitch + Illuvium Arena</option>
                    <option value="Custom Platform">Custom Platform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Tournament Rules</label>
                  <textarea
                    value={tournament.rules || ''}
                    onChange={(e) => updateTournament('rules', e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
                    placeholder="Enter tournament rules and regulations..."
                  />
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Rule Suggestions</span>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Standard Illuvium Gauntlet rules apply</li>
                    <li>• No coaching allowed during matches</li>
                    <li>• Players must check in 15 minutes before start</li>
                    <li>• Disconnections: 5-minute grace period</li>
                    <li>• Disputes will be resolved by tournament organizer</li>
                    <li>• Rewards distributed via IMX Passport player IDs</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentCreator;