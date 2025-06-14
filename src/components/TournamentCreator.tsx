import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Trophy, Clock, MapPin, DollarSign, Settings, Plus, X, AlertCircle, Edit2 } from 'lucide-react';
import { Tournament, TournamentRound, TournamentDivision, TournamentPhase, ScoringSystem, TiebreakerRule } from '../types';
import { useAuth } from '../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid';

interface TournamentCreatorProps {
  onBack: () => void;
  onCreateTournament: (tournament: Partial<Tournament>) => void;
}

// Step definitions for the wizard
const steps = [
  { key: 'basic', title: 'Basic Info', description: 'Name, description, type, organizer' },
  { key: 'schedule', title: 'Schedule', description: 'Registration & start times' },
  { key: 'format', title: 'Format & Structure', description: 'Format, participants, rounds' },
  { key: 'divisions', title: 'Divisions (Optional)', description: 'ELO ranges, prizes' },
  { key: 'phases', title: 'Phases', description: 'Phases, advancement' },
  { key: 'scoring', title: 'Scoring & Tiebreakers', description: 'Custom scoring, tiebreakers' },
  { key: 'prizes', title: 'Prizes', description: 'Prize pool, breakdown' },
  { key: 'review', title: 'Review & Create', description: 'Summary & confirmation' },
];

const standardEloDivisions = [
  { name: 'Iron 1', min: 0, max: 699 },
  { name: 'Iron 2', min: 700, max: 799 },
  { name: 'Iron 3', min: 800, max: 899 },
  { name: 'Bronze 1', min: 900, max: 999 },
  { name: 'Bronze 2', min: 1000, max: 1099 },
  { name: 'Bronze 3', min: 1100, max: 1199 },
  { name: 'Silver 1', min: 1200, max: 1299 },
  { name: 'Silver 2', min: 1300, max: 1399 },
  { name: 'Silver 3', min: 1400, max: 1499 },
  { name: 'Gold 1', min: 1500, max: 1599 },
  { name: 'Gold 2', min: 1600, max: 1699 },
  { name: 'Gold 3', min: 1700, max: 1799 },
  { name: 'Platinum 1', min: 1800, max: 1899 },
  { name: 'Platinum 2', min: 1900, max: 1999 },
  { name: 'Platinum 3', min: 2000, max: 2099 },
  { name: 'Diamond 1', min: 2100, max: 2199 },
  { name: 'Diamond 2', min: 2200, max: 2299 },
  { name: 'Diamond 3', min: 2300, max: 2399 },
  { name: 'Master 1', min: 2400, max: 2499 },
  { name: 'Master 2', min: 2500, max: 2599 },
  { name: 'Master 3', min: 2600, max: 2699 },
  { name: 'Grandmaster 1', min: 2700, max: 2799 },
  { name: 'Grandmaster 2', min: 2800, max: 2899 },
  { name: 'Grandmaster 3', min: 2900, max: 9999 },
];

const DivisionForm: React.FC<{
  initialDivision: Partial<TournamentDivision> | null;
  onSave: (d: TournamentDivision) => void;
  onCancel: () => void;
}> = ({ initialDivision, onSave, onCancel }) => {
  const [form, setForm] = React.useState<Partial<TournamentDivision>>(
    initialDivision || { name: '', eloRange: { min: 0, max: 0 }, expectedPopulation: 'medium', prizePool: 0 }
  );
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 w-full max-w-lg">
        <h3 className="text-white text-xl font-semibold mb-4">{initialDivision ? 'Edit Division' : 'Add Division'}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Division Name</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-gray-300 font-medium mb-2">Min ELO</label>
              <input
                type="number"
                value={form.eloRange?.min ?? 0}
                onChange={e => setForm(prev => ({
                  ...prev,
                  eloRange: {
                    min: parseInt(e.target.value),
                    max: prev.eloRange?.max ?? 0
                  }
                }))}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-2">Max ELO</label>
              <input
                type="number"
                value={form.eloRange?.max ?? 0}
                onChange={e => setForm(prev => ({
                  ...prev,
                  eloRange: {
                    min: prev.eloRange?.min ?? 0,
                    max: parseInt(e.target.value)
                  }
                }))}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Expected Population</label>
            <select
              value={form.expectedPopulation || 'medium'}
              onChange={e => setForm(prev => ({ ...prev, expectedPopulation: e.target.value as TournamentDivision['expectedPopulation'] }))}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="very-low">Very Low</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Prize Pool (ILV)</label>
            <input
              type="number"
              value={form.prizePool || 0}
              onChange={e => setForm(prev => ({ ...prev, prizePool: parseInt(e.target.value) }))}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={onCancel}
            className="bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={() => form.name && form.eloRange && typeof form.eloRange.min === 'number' && typeof form.eloRange.max === 'number' && onSave(form as TournamentDivision)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
            disabled={!form.name || !form.eloRange || typeof form.eloRange.min !== 'number' || typeof form.eloRange.max !== 'number'}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline PhaseForm component
const PhaseForm: React.FC<{
  initialPhase: Partial<TournamentPhase> | null;
  onSave: (p: TournamentPhase) => void;
  onCancel: () => void;
}> = ({ initialPhase, onSave, onCancel }) => {
  const [form, setForm] = React.useState<Partial<TournamentPhase>>(
    initialPhase || { name: '', type: 'qualification', format: 'gauntlet', startTime: null, endTime: null, status: 'pending' }
  );
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 w-full max-w-lg">
        <h3 className="text-white text-xl font-semibold mb-4">{initialPhase ? 'Edit Phase' : 'Add Phase'}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Phase Name</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Phase Type</label>
            <select
              value={form.type || 'qualification'}
              onChange={e => setForm(prev => ({ ...prev, type: e.target.value as TournamentPhase['type'] }))}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
            >
              <option value="qualification">Qualification</option>
              <option value="sit-n-go">Sit-n-Go</option>
              <option value="knockout">Knockout</option>
              <option value="finals">Finals</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Format</label>
            <select
              value={form.format || 'gauntlet'}
              onChange={e => setForm(prev => ({ ...prev, format: e.target.value as TournamentPhase['format'] }))}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
            >
              <option value="gauntlet">Custom</option>
              <option value="bracket">Bracket</option>
              <option value="swiss">Swiss</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-medium mb-2">Start Time</label>
              <DatePicker
                selected={typeof form.startTime === 'string' && form.startTime ? new Date(form.startTime) : null}
                onChange={date => setForm(prev => ({ ...prev, startTime: date ? date.toISOString() : null }))}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-2">End Time</label>
              <DatePicker
                selected={typeof form.endTime === 'string' && form.endTime ? new Date(form.endTime) : null}
                onChange={date => setForm(prev => ({ ...prev, endTime: date ? date.toISOString() : null }))}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Advancing Players (optional)</label>
            <input
              type="number"
              value={form.advancingPlayers ?? ''}
              onChange={e => setForm(prev => ({ ...prev, advancingPlayers: parseInt(e.target.value) }))}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
              placeholder="Number of players advancing"
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={onCancel}
            className="bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={() => form.name && form.type && form.format && onSave({
              ...(form as TournamentPhase),
              id: form.id || uuidv4(),
              status: form.status || 'pending',
            })}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
            disabled={!form.name || !form.type || !form.format}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const TournamentCreator: React.FC<TournamentCreatorProps> = ({ onBack, onCreateTournament }) => {
  const { user, isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [tournament, setTournament] = useState<Partial<Tournament>>({
    name: '',
    description: '',
    type: 'custom',
    format: 'single-elimination',
    maxParticipants: 32,
    prizePool: '',
    registrationStart: null,
    registrationEnd: null,
    startTime: null,
    rules: '',
    hostPlatform: 'Illuvium Arena',
    rounds: [],
    phases: [],
    divisions: [],
    scoringSystem: undefined,
    checkInRequired: false,
    tiebreakers: [],
  });

  const [showDivisionModal, setShowDivisionModal] = useState(false);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Partial<TournamentDivision> | null>(null);
  const [editingPhase, setEditingPhase] = useState<Partial<Omit<TournamentPhase, 'startTime' | 'endTime'> & { startTime?: string; endTime?: string }>>();

  // Step 4: Divisions (Optional)
  const [showDivisionForm, setShowDivisionForm] = useState(false);

  // Step 5: Phases
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [editingPhaseIdx, setEditingPhaseIdx] = useState<number | null>(null);

  // Step 6: Scoring & Tiebreakers
  const [scoringType, setScoringType] = useState<'placement' | 'custom'>('placement');
  const [points, setPoints] = useState<{ placement: number; points: number }[]>([
    { placement: 1, points: 8 },
    { placement: 2, points: 4 },
    { placement: 3, points: 2 },
    { placement: 4, points: 1 },
  ]);
  const [minMatchesRequired, setMinMatchesRequired] = useState(0);
  const [negativePoints, setNegativePoints] = useState(false);
  const [tiebreakers, setTiebreakers] = useState<TiebreakerRule[]>([
    { order: 1, type: 'highest-single-score', description: 'Highest single-round score' },
    { order: 2, type: 'last-round-score', description: 'Last round score' },
    { order: 3, type: 'lowest-hp-lost', description: 'Lowest HP lost in last round' },
    { order: 4, type: 'strongest-opponents', description: 'Strongest opponents faced' },
    { order: 5, type: 'random', description: 'Random selection' },
  ]);

  // Step 7: Prizes
  const [prizePool, setPrizePool] = useState(tournament.prizePool || '');
  const [prizeBreakdown, setPrizeBreakdown] = useState<{ division: string; prize: string }[]>([]);
  const handleAddPrizeBreakdown = () => {
    setPrizeBreakdown(prev => [...prev, { division: '', prize: '' }]);
  };
  const handleRemovePrizeBreakdown = (idx: number) => {
    setPrizeBreakdown(prev => prev.filter((_, i) => i !== idx));
  };
  const handlePrizeBreakdownChange = (idx: number, field: 'division' | 'prize', value: string) => {
    setPrizeBreakdown(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };
  const handleSavePrizes = () => {
    setTournament(prev => ({
      ...prev,
      prizePool,
      prizeBreakdown,
    }));
    setActiveStep(activeStep + 1);
  };

  // Live summary panel content
  const renderSummary = () => (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 sticky top-8">
      <h3 className="text-white font-semibold mb-4">Live Summary</h3>
      <div className="text-gray-300 text-sm space-y-2">
        <div><span className="font-bold">Name:</span> {tournament.name || <span className="text-gray-500">(not set)</span>}</div>
        <div><span className="font-bold">Type:</span> {tournament.type || <span className="text-gray-500">(not set)</span>}</div>
        <div><span className="font-bold">Format:</span> {tournament.format || <span className="text-gray-500">(not set)</span>}</div>
        <div><span className="font-bold">Max Participants:</span> {tournament.maxParticipants || <span className="text-gray-500">(not set)</span>}</div>
        {/* Add more summary fields as needed */}
      </div>
    </div>
  );

  // Step 1: Basic Info
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold">Basic Information</h3>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Tournament Name *</label>
        <input
          type="text"
          value={tournament.name || ''}
          onChange={e => setTournament(prev => ({ ...prev, name: e.target.value }))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter tournament name..."
        />
      </div>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Description</label>
        <textarea
          value={tournament.description || ''}
          onChange={e => setTournament(prev => ({ ...prev, description: e.target.value }))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
          placeholder="Describe your tournament..."
        />
      </div>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Tournament Type</label>
        <select
          value={tournament.type || 'custom'}
          onChange={e => setTournament(prev => ({ ...prev, type: e.target.value as Tournament['type'] }))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="custom">Custom</option>
          <option value="standard">Standard</option>
          <option value="practice">Practice</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Organizer</label>
        <input
          type="text"
          value={user?.nickname || ''}
          disabled
          className="w-full bg-gray-700 text-gray-400 px-4 py-3 rounded-lg border border-gray-700"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setActiveStep(activeStep + 1)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
          disabled={!tournament.name}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 2: Schedule
  const renderSchedule = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold">Schedule</h3>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Registration Start</label>
        <DatePicker
          selected={tournament.registrationStart ? new Date(tournament.registrationStart) : null}
          onChange={date => setTournament(prev => ({ ...prev, registrationStart: date ? date.toISOString() : null }))}
          showTimeSelect
          dateFormat="Pp"
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
          placeholderText="Select registration start time"
        />
      </div>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Registration End</label>
        <DatePicker
          selected={tournament.registrationEnd ? new Date(tournament.registrationEnd) : null}
          onChange={date => setTournament(prev => ({ ...prev, registrationEnd: date ? date.toISOString() : null }))}
          showTimeSelect
          dateFormat="Pp"
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
          placeholderText="Select registration end time"
        />
      </div>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Tournament Start Time</label>
        <DatePicker
          selected={tournament.startTime ? new Date(tournament.startTime) : null}
          onChange={date => setTournament(prev => ({ ...prev, startTime: date ? date.toISOString() : null }))}
          showTimeSelect
          dateFormat="Pp"
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
          placeholderText="Select tournament start time"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!tournament.checkInRequired}
          onChange={e => setTournament(prev => ({ ...prev, checkInRequired: e.target.checked }))}
          id="checkin-required"
          className="form-checkbox h-5 w-5 text-purple-600"
        />
        <label htmlFor="checkin-required" className="text-gray-300 font-medium">Require player check-in</label>
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setActiveStep(activeStep - 1)}
          className="bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={() => setActiveStep(activeStep + 1)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
          disabled={!tournament.registrationStart || !tournament.registrationEnd || !tournament.startTime}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 3: Format & Structure
  const renderFormatStructure = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold">Format & Structure</h3>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Format</label>
        <select
          value={tournament.format || 'single-elimination'}
          onChange={e => setTournament(prev => ({ ...prev, format: e.target.value as Tournament['format'] }))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="single-elimination">Single Elimination</option>
          <option value="double-elimination">Double Elimination</option>
          <option value="round-robin">Round Robin</option>
          <option value="swiss">Swiss</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Max Participants</label>
        <select
          value={tournament.maxParticipants || 32}
          onChange={e => setTournament(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
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
        <label className="block text-gray-300 font-medium mb-2">Rounds (optional)</label>
        <input
          type="number"
          min={1}
          value={tournament.rounds && tournament.rounds.length > 0 ? tournament.rounds.length : ''}
          onChange={e => {
            const numRounds = parseInt(e.target.value);
            if (!isNaN(numRounds) && numRounds > 0) {
              setTournament(prev => ({
                ...prev,
                rounds: Array.from({ length: numRounds }, (_, i) => ({
                  roundNumber: i + 1,
                  name: `Round ${i + 1}`,
                  format: 'bo1',
                  startTime: null,
                  advancingPlayers: Math.floor((prev.maxParticipants || 32) / Math.pow(2, i + 1)),
                  status: 'pending',
                }))
              }));
            } else {
              setTournament(prev => ({ ...prev, rounds: [] }));
            }
          }}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Number of rounds (optional)"
        />
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setActiveStep(activeStep - 1)}
          className="bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={() => setActiveStep(activeStep + 1)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
          disabled={!tournament.format || !tournament.maxParticipants}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 4: Divisions (Optional)
  const handleAddDivision = (division: TournamentDivision) => {
    setTournament(prev => ({
      ...prev,
      divisions: [...(prev.divisions || []), division]
    }));
    setShowDivisionForm(false);
    setEditingDivision(null);
  };

  const handleEditDivision = (index: number, division: TournamentDivision) => {
    setTournament(prev => ({
      ...prev,
      divisions: prev.divisions?.map((d, i) => (i === index ? division : d)) || []
    }));
    setShowDivisionForm(false);
    setEditingDivision(null);
  };

  const handleRemoveDivision = (index: number) => {
    setTournament(prev => ({
      ...prev,
      divisions: prev.divisions?.filter((_, i) => i !== index) || []
    }));
  };

  const handleQuickAddStandardDivisions = () => {
    setTournament(prev => ({
      ...prev,
      divisions: standardEloDivisions.map((d, i) => ({
        id: `${d.name.replace(/\s/g, '').toLowerCase()}-${i}`,
        name: d.name,
        eloRange: { min: d.min, max: d.max },
        expectedPopulation: 'medium',
        prizePool: 0,
        rewards: [],
      }))
    }));
  };

  const renderDivisions = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold">Divisions <span className="text-gray-400 text-base">(Optional)</span></h3>
      <div className="space-y-4">
        {(tournament.divisions || []).length === 0 && (
          <div className="text-gray-400">No divisions added yet.</div>
        )}
        {(tournament.divisions || []).map((division, idx) => (
          <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">{division.name}</div>
              <div className="text-gray-400 text-sm">ELO: {division.eloRange?.min} - {division.eloRange?.max}</div>
              <div className="text-gray-400 text-sm">Population: {division.expectedPopulation}</div>
              <div className="text-gray-400 text-sm">Prize Pool: {division.prizePool} ILV</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingDivision(division); setShowDivisionForm(true); }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold"
              >Edit</button>
              <button
                onClick={() => handleRemoveDivision(idx)}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold"
              >Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => { setEditingDivision(null); setShowDivisionForm(true); }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
        >
          Add Division
        </button>
        <button
          onClick={handleQuickAddStandardDivisions}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-500 hover:to-blue-500 transition-all duration-300"
        >
          Add Standard ELO Divisions
        </button>
        <button
          onClick={() => setActiveStep(activeStep + 1)}
          className="bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
        >
          Skip
        </button>
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setActiveStep(activeStep - 1)}
          className="bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={() => setActiveStep(activeStep + 1)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
          disabled={(tournament.divisions || []).length === 0}
        >
          Next
        </button>
      </div>
      {showDivisionForm && (
        <DivisionForm
          initialDivision={editingDivision}
          onSave={editingDivision ? (d => handleEditDivision((tournament.divisions || []).findIndex(div => div === editingDivision), d)) : handleAddDivision}
          onCancel={() => { setShowDivisionForm(false); setEditingDivision(null); }}
        />
      )}
    </div>
  );

  // Stepper UI
  const renderStepper = () => (
    <div className="mb-8">
      <div className="flex flex-col gap-2">
        {steps.map((step, idx) => (
          <div key={step.key} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === idx ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{idx + 1}</div>
            <div>
              <div className={`font-medium ${activeStep === idx ? 'text-white' : 'text-gray-400'}`}>{step.title}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
      startTime: null,
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
      participants: [],
      // Convert Date objects to ISO strings for backend compatibility
      registrationStart: tournament.registrationStart,
      registrationEnd: tournament.registrationEnd,
      startTime: tournament.startTime,
    });
  };

  const handleAddPhase = (phase: TournamentPhase) => {
    setTournament(prev => ({
      ...prev,
      phases: [...(prev.phases || []), phase]
    }));
    setShowPhaseForm(false);
    setEditingPhaseIdx(null);
  };

  const handleEditPhase = (index: number, phase: TournamentPhase) => {
    setTournament(prev => ({
      ...prev,
      phases: prev.phases?.map((p, i) => (i === index ? phase : p)) || []
    }));
    setShowPhaseForm(false);
    setEditingPhaseIdx(null);
  };

  const handleRemovePhase = (index: number) => {
    setTournament(prev => ({
      ...prev,
      phases: prev.phases?.filter((_, i) => i !== index) || []
    }));
  };

  const renderPhases = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold">Phases</h3>
      <div className="space-y-4">
        {(tournament.phases || []).length === 0 && (
          <div className="text-gray-400">No phases added yet.</div>
        )}
        {(tournament.phases || []).map((phase, idx) => (
          <div key={phase.id || idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">{phase.name}</div>
              <div className="text-gray-400 text-sm">Type: {phase.type}, Format: {phase.format}</div>
              <div className="text-gray-400 text-sm">Start: {phase.startTime ? new Date(phase.startTime).toLocaleString() : 'N/A'}</div>
              <div className="text-gray-400 text-sm">End: {phase.endTime ? new Date(phase.endTime).toLocaleString() : 'N/A'}</div>
              {phase.advancingPlayers && <div className="text-gray-400 text-sm">Advancing: {phase.advancingPlayers}</div>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingPhaseIdx(idx); setShowPhaseForm(true); }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold"
              >Edit</button>
              <button
                onClick={() => handleRemovePhase(idx)}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold"
              >Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => { setEditingPhaseIdx(null); setShowPhaseForm(true); }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
        >
          Add Phase
        </button>
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setActiveStep(activeStep - 1)}
          className="bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={() => setActiveStep(activeStep + 1)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
          disabled={(tournament.phases || []).length === 0}
        >
          Next
        </button>
      </div>
      {showPhaseForm && (
        <PhaseForm
          initialPhase={editingPhaseIdx !== null && tournament.phases ? tournament.phases[editingPhaseIdx] : null}
          onSave={editingPhaseIdx !== null ? (p => handleEditPhase(editingPhaseIdx, p)) : handleAddPhase}
          onCancel={() => { setShowPhaseForm(false); setEditingPhaseIdx(null); }}
        />
      )}
    </div>
  );

  const handleAddPlacement = () => {
    setPoints(prev => [...prev, { placement: prev.length + 1, points: 0 }]);
  };
  const handleRemovePlacement = (idx: number) => {
    setPoints(prev => prev.filter((_, i) => i !== idx));
  };
  const handlePointsChange = (idx: number, value: number) => {
    setPoints(prev => prev.map((p, i) => i === idx ? { ...p, points: value } : p));
  };
  const handlePlacementChange = (idx: number, value: number) => {
    setPoints(prev => prev.map((p, i) => i === idx ? { ...p, placement: value } : p));
  };
  const handleTiebreakerOrder = (idx: number, direction: 'up' | 'down') => {
    setTiebreakers(prev => {
      const newArr = [...prev];
      if (direction === 'up' && idx > 0) {
        [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
      } else if (direction === 'down' && idx < newArr.length - 1) {
        [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
      }
      return newArr.map((tb, i) => ({ ...tb, order: i + 1 }));
    });
  };

  const handleSaveScoring = () => {
    setTournament(prev => ({
      ...prev,
      scoringSystem: {
        type: scoringType,
        points: points,
        minMatchesRequired,
        negativePoints,
      },
      tiebreakers: tiebreakers,
    }));
    setActiveStep(activeStep + 1);
  };

  const renderScoring = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold">Scoring & Tiebreakers</h3>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Scoring Type</label>
        <select
          value={scoringType}
          onChange={e => setScoringType(e.target.value as 'placement' | 'custom')}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
        >
          <option value="placement">Placement Points</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      {scoringType === 'placement' && (
        <div className="space-y-2">
          <div className="flex gap-2 items-center font-semibold text-gray-200">Placement Points</div>
          {points.map((p, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="number"
                value={p.placement}
                onChange={e => handlePlacementChange(idx, parseInt(e.target.value))}
                className="w-20 bg-gray-800 text-white px-2 py-1 rounded border border-gray-700"
                min={1}
              />
              <span className="text-gray-400">Place</span>
              <input
                type="number"
                value={p.points}
                onChange={e => handlePointsChange(idx, parseInt(e.target.value))}
                className="w-24 bg-gray-800 text-white px-2 py-1 rounded border border-gray-700"
              />
              <span className="text-gray-400">Points</span>
              <button onClick={() => handleRemovePlacement(idx)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
            </div>
          ))}
          <button onClick={handleAddPlacement} className="mt-2 bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold">Add Placement</button>
        </div>
      )}
      {scoringType === 'custom' && (
        <div className="space-y-2">
          <div className="text-gray-400">Custom scoring will be configured in a future update.</div>
        </div>
      )}
      <div>
        <label className="block text-gray-300 font-medium mb-2">Minimum Matches Required</label>
        <input
          type="number"
          value={minMatchesRequired}
          onChange={e => setMinMatchesRequired(parseInt(e.target.value))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
          min={0}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={negativePoints}
          onChange={e => setNegativePoints(e.target.checked)}
          id="negative-points"
          className="form-checkbox h-5 w-5 text-purple-600"
        />
        <label htmlFor="negative-points" className="text-gray-300 font-medium">Allow negative points</label>
      </div>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Tiebreaker Order</label>
        <div className="space-y-2">
          {tiebreakers.map((tb, idx) => (
            <div key={tb.type} className="flex items-center gap-2">
              <span className="text-gray-200 font-semibold">{tb.description}</span>
              <button disabled={idx === 0} onClick={() => handleTiebreakerOrder(idx, 'up')} className="text-xs px-2 py-1 bg-gray-700 rounded disabled:opacity-50">↑</button>
              <button disabled={idx === tiebreakers.length - 1} onClick={() => handleTiebreakerOrder(idx, 'down')} className="text-xs px-2 py-1 bg-gray-700 rounded disabled:opacity-50">↓</button>
              <span className="text-gray-400 text-xs">#{tb.order}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setActiveStep(activeStep - 1)}
          className="bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={handleSaveScoring}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderPrizes = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold">Prizes</h3>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Overall Prize Pool</label>
        <input
          type="text"
          value={prizePool}
          onChange={e => setPrizePool(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
          placeholder="e.g., 1000 ILV + NFTs"
        />
      </div>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Division/Placement Breakdown (optional)</label>
        {prizeBreakdown.map((p, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-2">
            <input
              type="text"
              value={p.division}
              onChange={e => handlePrizeBreakdownChange(idx, 'division', e.target.value)}
              className="w-48 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700"
              placeholder="Division/Placement"
            />
            <input
              type="text"
              value={p.prize}
              onChange={e => handlePrizeBreakdownChange(idx, 'prize', e.target.value)}
              className="w-48 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700"
              placeholder="Prize"
            />
            <button onClick={() => handleRemovePrizeBreakdown(idx)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
          </div>
        ))}
        <button onClick={handleAddPrizeBreakdown} className="mt-2 bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold">Add Breakdown</button>
      </div>
      <div>
        <label className="block text-gray-300 font-medium mb-2">Preview</label>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-gray-200">
          <div><span className="font-bold">Total Prize Pool:</span> {prizePool || <span className="text-gray-500">(not set)</span>}</div>
          {prizeBreakdown.length > 0 && (
            <div className="mt-2">
              <div className="font-semibold mb-1">Breakdown:</div>
              <ul className="list-disc ml-6">
                {prizeBreakdown.map((p, idx) => (
                  <li key={idx}>{p.division}: {p.prize}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setActiveStep(activeStep - 1)}
          className="bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={handleSavePrizes}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 8: Review & Create
  const renderReview = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold">Review & Create</h3>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-gray-200">
        <div className="mb-4">
          <span className="font-bold">Name:</span> {tournament.name}
        </div>
        <div className="mb-4">
          <span className="font-bold">Description:</span> {tournament.description}
        </div>
        <div className="mb-4">
          <span className="font-bold">Type:</span> {tournament.type}
        </div>
        <div className="mb-4">
          <span className="font-bold">Format:</span> {tournament.format}
        </div>
        <div className="mb-4">
          <span className="font-bold">Max Participants:</span> {tournament.maxParticipants}
        </div>
        <div className="mb-4">
          <span className="font-bold">Registration:</span> {tournament.registrationStart && new Date(tournament.registrationStart).toLocaleString()} - {tournament.registrationEnd && new Date(tournament.registrationEnd).toLocaleString()}
        </div>
        <div className="mb-4">
          <span className="font-bold">Start Time:</span> {tournament.startTime && new Date(tournament.startTime).toLocaleString()}
        </div>
        <div className="mb-4">
          <span className="font-bold">Check-in Required:</span> {tournament.checkInRequired ? 'Yes' : 'No'}
        </div>
        <div className="mb-4">
          <span className="font-bold">Divisions:</span>
          {(tournament.divisions && tournament.divisions.length > 0) ? (
            <ul className="list-disc ml-6">
              {tournament.divisions.map((d, idx) => (
                <li key={idx}>{d.name} (ELO: {d.eloRange?.min}-{d.eloRange?.max}, Prize: {d.prizePool} ILV)</li>
              ))}
            </ul>
          ) : <span className="text-gray-400 ml-2">None</span>}
        </div>
        <div className="mb-4">
          <span className="font-bold">Phases:</span>
          {(tournament.phases && tournament.phases.length > 0) ? (
            <ul className="list-disc ml-6">
              {tournament.phases.map((p, idx) => (
                <li key={idx}>{p.name} ({p.type}, {p.format}, {p.startTime && new Date(p.startTime).toLocaleString()} - {p.endTime && new Date(p.endTime).toLocaleString()})</li>
              ))}
            </ul>
          ) : <span className="text-gray-400 ml-2">None</span>}
        </div>
        <div className="mb-4">
          <span className="font-bold">Scoring System:</span> {tournament.scoringSystem?.type}
          {tournament.scoringSystem?.points && (
            <ul className="list-disc ml-6">
              {tournament.scoringSystem.points.map((p, idx) => (
                <li key={idx}>Place {p.placement}: {p.points} points</li>
              ))}
            </ul>
          )}
          <div className="text-gray-400 text-sm">Min Matches: {tournament.scoringSystem?.minMatchesRequired} | Negative Points: {tournament.scoringSystem?.negativePoints ? 'Yes' : 'No'}</div>
        </div>
        <div className="mb-4">
          <span className="font-bold">Tiebreakers:</span>
          {tournament.tiebreakers && tournament.tiebreakers.length > 0 ? (
            <ul className="list-disc ml-6">
              {tournament.tiebreakers.map((tb, idx) => (
                <li key={idx}>{tb.description}</li>
              ))}
            </ul>
          ) : <span className="text-gray-400 ml-2">None</span>}
        </div>
        <div className="mb-4">
          <span className="font-bold">Prize Pool:</span> {tournament.prizePool}
          {tournament.prizeBreakdown && tournament.prizeBreakdown.length > 0 && (
            <ul className="list-disc ml-6">
              {tournament.prizeBreakdown.map((p, idx) => (
                <li key={idx}>{p.division}: {p.prize}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setActiveStep(activeStep - 1)}
          className="bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
        >
          Back
        </button>
        <button
          onClick={() => onCreateTournament(tournament)}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-500 hover:to-blue-500 transition-all duration-300"
        >
          Create Tournament
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        {renderStepper()}
        {renderSummary()}
      </div>
      <div className="md:col-span-3 bg-gray-900 rounded-xl p-8 border border-gray-700">
        {activeStep === 0 && renderBasicInfo()}
        {activeStep === 1 && renderSchedule()}
        {activeStep === 2 && renderFormatStructure()}
        {activeStep === 3 && renderDivisions()}
        {activeStep === 4 && renderPhases()}
        {activeStep === 5 && renderScoring()}
        {activeStep === 6 && renderPrizes()}
        {activeStep === 7 && renderReview()}
      </div>

      {/* Phase Modal */}
      {showPhaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 w-full max-w-lg">
            <h3 className="text-white text-xl font-semibold mb-4">
              {editingPhase ? 'Edit Phase' : 'Add Phase'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Phase Name</label>
                <input
                  type="text"
                  value={editingPhase?.name || ''}
                  onChange={(e) => setEditingPhase(prev => ({ ...prev!, name: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-2">Phase Type</label>
                <select
                  value={editingPhase?.type || 'qualification'}
                  onChange={(e) => setEditingPhase(prev => ({
                    ...prev!,
                    type: e.target.value as TournamentPhase['type']
                  }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                >
                  <option value="qualification">Qualification</option>
                  <option value="sit-n-go">Sit-n-Go</option>
                  <option value="knockout">Knockout</option>
                  <option value="finals">Finals</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-2">Format</label>
                <select
                  value={editingPhase?.format || 'gauntlet'}
                  onChange={(e) => setEditingPhase(prev => ({
                    ...prev!,
                    format: e.target.value as TournamentPhase['format']
                  }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                >
                  <option value="gauntlet">Custom</option>
                  <option value="bracket">Bracket</option>
                  <option value="swiss">Swiss</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Start Time</label>
                  <DatePicker
                    selected={typeof editingPhase?.startTime === 'string' && editingPhase.startTime ? new Date(editingPhase.startTime) : null}
                    onChange={(date: Date | null) => setEditingPhase(prev => ({ ...prev!, startTime: date ? date.toISOString() : undefined }))}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">End Time</label>
                  <DatePicker
                    selected={typeof editingPhase?.endTime === 'string' && editingPhase.endTime ? new Date(editingPhase.endTime) : null}
                    onChange={(date: Date | null) => setEditingPhase(prev => ({ ...prev!, endTime: date ? date.toISOString() : undefined }))}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-2">Advancing Players</label>
                <input
                  type="number"
                  value={editingPhase?.advancingPlayers || 0}
                  onChange={(e) => setEditingPhase(prev => ({
                    ...prev!,
                    advancingPlayers: parseInt(e.target.value)
                  }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => { setShowPhaseModal(false); setEditingPhase(undefined); }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentCreator;