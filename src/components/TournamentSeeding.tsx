import React, { useState } from 'react';
import { GripVertical, Trophy, Users } from 'lucide-react';
import { TournamentParticipant } from '../types';

interface TournamentSeedingProps {
  participants: TournamentParticipant[];
  onSeedingComplete: (seededParticipants: TournamentParticipant[]) => void;
  isAdmin: boolean;
}

const TournamentSeeding: React.FC<TournamentSeedingProps> = ({
  participants,
  onSeedingComplete,
  isAdmin,
}) => {
  const [seededParticipants, setSeededParticipants] = useState<TournamentParticipant[]>(participants);
  const [draggedItem, setDraggedItem] = useState<TournamentParticipant | null>(null);

  const handleDragStart = (participant: TournamentParticipant) => {
    setDraggedItem(participant);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetParticipant: TournamentParticipant) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newSeededParticipants = [...seededParticipants];
    const draggedIndex = newSeededParticipants.findIndex(p => p.id === draggedItem.id);
    const targetIndex = newSeededParticipants.findIndex(p => p.id === targetParticipant.id);

    // Swap positions
    [newSeededParticipants[draggedIndex], newSeededParticipants[targetIndex]] = 
    [newSeededParticipants[targetIndex], newSeededParticipants[draggedIndex]];

    setSeededParticipants(newSeededParticipants);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/30 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white text-xl font-bold">Tournament Seeding</h3>
          <p className="text-slate-400 text-sm">Drag and drop to reorder participants</p>
        </div>
      </div>

      {/* Seeding List */}
      <div className="space-y-3">
        {seededParticipants.map((participant, index) => (
          <div
            key={participant.id}
            draggable={isAdmin}
            onDragStart={() => handleDragStart(participant)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, participant)}
            onDragEnd={handleDragEnd}
            className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
              draggedItem?.id === participant.id
                ? 'bg-purple-500/20 border-purple-500/50'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/30'
            }`}
          >
            {/* Drag Handle */}
            <div className="text-slate-500 group-hover:text-cyan-400 transition-colors">
              <GripVertical className="w-5 h-5" />
            </div>

            {/* Position Number */}
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-slate-600/50">
              <span className="text-white font-bold">{index + 1}</span>
            </div>

            {/* Participant Info */}
            <div className="flex-1">
              <div className="text-white font-semibold">{participant.rangerName}</div>
              <div className="text-slate-400 text-sm">{participant.illuviumPlayerId}</div>
            </div>

            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              participant.status === 'registered'
                ? 'bg-green-500/20 text-green-400'
                : participant.status === 'pending'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      {isAdmin && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => onSeedingComplete(seededParticipants)}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Generate Bracket
          </button>
        </div>
      )}
    </div>
  );
};

export default TournamentSeeding; 