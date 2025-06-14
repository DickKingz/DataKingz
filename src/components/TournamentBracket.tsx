import React from 'react';
import { Trophy, RefreshCw, ChevronRight } from 'lucide-react';
import type { TournamentBracket, TournamentParticipant } from '../types';

interface TournamentBracketProps {
  bracket: TournamentBracket;
  onSetWinner: (matchId: string, winner: TournamentParticipant) => void;
  onRegenerateBracket: () => void;
  isAdmin: boolean;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({
  bracket,
  onSetWinner,
  onRegenerateBracket,
  isAdmin,
}) => {
  const renderMatch = (match: any, roundNumber: number) => {
    const isWinner = (participant: TournamentParticipant | undefined) => 
      match.winner?.id === participant?.id;

    return (
      <div 
        key={match.id}
        className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4 hover:border-cyan-500/30 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          {/* Player 1 */}
          <div className={`flex-1 p-3 rounded-lg ${
            isWinner(match.player1) 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-slate-700/50 border border-slate-600/50'
          }`}>
            {match.player1 ? (
              <div className="text-white font-semibold">{match.player1.rangerName}</div>
            ) : (
              <div className="text-slate-500 italic">TBD</div>
            )}
          </div>

          {/* VS */}
          <div className="text-slate-400 font-bold">VS</div>

          {/* Player 2 */}
          <div className={`flex-1 p-3 rounded-lg ${
            isWinner(match.player2) 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-slate-700/50 border border-slate-600/50'
          }`}>
            {match.player2 ? (
              <div className="text-white font-semibold">{match.player2.rangerName}</div>
            ) : (
              <div className="text-slate-500 italic">TBD</div>
            )}
          </div>

          {/* Admin Controls */}
          {isAdmin && match.player1 && match.player2 && !match.winner && (
            <div className="flex gap-2">
              <button
                onClick={() => onSetWinner(match.id, match.player1)}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300"
              >
                Set {match.player1.rangerName} as Winner
              </button>
              <button
                onClick={() => onSetWinner(match.id, match.player2)}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300"
              >
                Set {match.player2.rangerName} as Winner
              </button>
            </div>
          )}
        </div>

        {/* Match Status */}
        <div className="mt-2 text-right">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            match.status === 'completed'
              ? 'bg-green-500/20 text-green-400'
              : match.status === 'live'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-slate-500/20 text-slate-400'
          }`}>
            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/30 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-xl font-bold">Tournament Bracket</h3>
            <p className="text-slate-400 text-sm">View and manage tournament matches</p>
          </div>
        </div>

        {/* Regenerate Button */}
        {isAdmin && (
          <button
            onClick={onRegenerateBracket}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Bracket
          </button>
        )}
      </div>

      {/* Bracket Rounds */}
      <div className="space-y-8">
        {bracket.rounds.map((round, index) => (
          <div key={round.roundNumber} className="relative">
            {/* Round Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-slate-600/50">
                <span className="text-white font-bold">{round.roundNumber}</span>
              </div>
              <h4 className="text-white font-semibold">Round {round.roundNumber}</h4>
            </div>

            {/* Matches */}
            <div className="space-y-4">
              {round.matches.map(match => renderMatch(match, round.roundNumber))}
            </div>

            {/* Round Connector */}
            {index < bracket.rounds.length - 1 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <ChevronRight className="w-6 h-6 text-slate-600" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentBracket; 