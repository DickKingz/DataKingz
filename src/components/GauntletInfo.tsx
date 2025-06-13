import React from 'react';
import { Trophy, Target, Clock, Users, Shield, Zap } from 'lucide-react';
import { GauntletData } from '../types';

interface GauntletInfoProps {
  data: GauntletData;
}

const GauntletInfo: React.FC<GauntletInfoProps> = ({ data }) => {
  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl p-8 border border-purple-500">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-white text-4xl font-bold mb-2">{data.title}</h1>
            <p className="text-purple-200 text-lg font-medium">{data.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4 border border-purple-400">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Duration</span>
            </div>
            <p className="text-purple-200">{data.duration}</p>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4 border border-purple-400">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Participants</span>
            </div>
            <p className="text-purple-200">{data.participants.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4 border border-purple-400">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Status</span>
            </div>
            <p className="text-purple-200">{data.status}</p>
          </div>
        </div>
      </div>

      {/* Meta Compositions */}
      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
        <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-400" />
          Meta Compositions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.metaComps.map((comp, idx) => (
            <div key={idx} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">#{idx + 1}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{comp.name}</h3>
                  <p className="text-gray-400 text-sm">{comp.winRate}% Win Rate</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-300 text-sm">Popularity:</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${comp.popularity}%` }}
                  />
                </div>
                <span className="text-purple-400 text-sm font-medium">{comp.popularity}%</span>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {comp.keyUnits.map((unit, unitIdx) => (
                  <div key={unitIdx} className="w-8 h-8 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center text-xs text-white font-bold">
                    {unit[0]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
        <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
          <Zap className="w-6 h-6 text-purple-400" />
          Rewards & Rankings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Players */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">Top Players</h3>
            <div className="space-y-3">
              {data.topPlayers.map((player, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                    idx === 0 ? 'bg-yellow-500' :
                    idx === 1 ? 'bg-gray-400' :
                    idx === 2 ? 'bg-orange-500' :
                    'bg-gray-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{player.name}</div>
                    <div className="text-gray-400 text-sm">{player.points} points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Rewards */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">Reward Tiers</h3>
            <div className="space-y-3">
              {data.rewards.map((reward, idx) => (
                <div key={idx} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{reward.tier}</span>
                    <span className="text-purple-400 font-medium">{reward.requirement}</span>
                  </div>
                  <div className="text-gray-300 text-sm">{reward.reward}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GauntletInfo;