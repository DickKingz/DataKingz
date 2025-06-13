import React from 'react';
import { ArrowLeft, Star, Zap } from 'lucide-react';
import { TeamComposition as TeamCompositionType } from '../types';
import PositioningBoard from './PositioningBoard';

interface TeamCompositionProps {
  composition: TeamCompositionType;
  onBack: () => void;
}

const TeamComposition: React.FC<TeamCompositionProps> = ({ composition, onBack }) => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-all duration-300 bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2 rounded-xl border border-slate-700/50 hover:border-cyan-500/30"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Comps
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Composition Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Info */}
          <div className="relative bg-gradient-to-br from-red-600/90 via-red-700/90 to-red-800/90 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30 shadow-2xl shadow-red-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <span className="text-white text-4xl font-black">{composition.tier}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-2xl blur-lg opacity-50 -z-10" />
                </div>
                <div>
                  <h1 className="text-white text-3xl font-bold mb-2">{composition.name}</h1>
                  <p className="text-red-200 text-lg font-medium">{composition.playstyle}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-6">
                {composition.difficulty.map((_, idx) => (
                  <Star key={idx} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
                {Array.from({ length: 5 - composition.difficulty.length }).map((_, idx) => (
                  <Star key={idx} className="w-6 h-6 text-slate-400" />
                ))}
              </div>

              <div className="text-red-100 font-medium">
                <strong className="text-white">Playstyle:</strong> {composition.playstyle}
              </div>
            </div>
          </div>

          {/* Champions */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
            <h3 className="text-white text-xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Champions
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {composition.champions.map((champion, idx) => (
                <div key={idx} className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-center border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
                  <div className="relative w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl mx-auto mb-3 flex items-center justify-center border border-slate-600/50 group-hover:border-cyan-500/30 transition-all duration-300">
                    <span className="text-white font-bold text-lg">{champion.name[0]}</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="text-white text-sm font-semibold mb-1">{champion.name}</div>
                  <div className="text-slate-400 text-xs">{champion.cost} cost</div>
                </div>
              ))}
            </div>
          </div>

          {/* Augments */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
            <h3 className="text-white text-xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Augment Priority
            </h3>
            <div className="space-y-4">
              {composition.augments.map((augment, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="relative w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 group-hover:border-cyan-500/30 flex items-center justify-center transition-all duration-300">
                    <span className="text-white text-sm font-bold">{augment.name[0]}</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <span className="text-white font-medium">{augment.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Tags */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
            <h3 className="text-white text-xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Priority
            </h3>
            <div className="flex gap-3 flex-wrap">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-yellow-500/30">
                ECON
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30">
                ITEMS
              </div>
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-500/30">
                COMBAT
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="relative bg-gradient-to-br from-yellow-500/90 to-amber-600/90 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
            
            <div className="relative z-10">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1.5 rounded-lg text-sm font-bold inline-block mb-4 shadow-lg">
                <Zap className="w-4 h-4 inline mr-1" />
                TIP
              </div>
              <p className="text-black font-medium leading-relaxed">{composition.tip}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Positioning and Strategy */}
        <div className="lg:col-span-2 space-y-6">
          {/* Early Comp */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
            <h3 className="text-white text-xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Early Comp
            </h3>
            <div className="flex gap-4 flex-wrap">
              {composition.earlyComp.map((champion, idx) => (
                <div key={idx} className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-3 text-center border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
                  <div className="relative w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mx-auto mb-2 flex items-center justify-center border border-slate-600/50 group-hover:border-cyan-500/30 transition-all duration-300">
                    <span className="text-white text-sm font-bold">{champion.name[0]}</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="text-white text-xs font-medium">{champion.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Item Priority */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
            <h3 className="text-white text-xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Item Priority
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              {composition.itemPriority.map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 group">
                    <span className="text-white text-sm font-bold">{item.name[0]}</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {idx < composition.itemPriority.length - 1 && (
                    <span className="text-cyan-400 text-2xl font-bold">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Positioning Board */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
            <h3 className="text-white text-xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Positioning Example
            </h3>
            <PositioningBoard champions={composition.positioning} size="medium" />
          </div>

          {/* Strategy Stages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {composition.stages.map((stage, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105">
                <h4 className="text-white font-bold text-lg mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Stage {stage.stage}
                </h4>
                <p className="text-slate-300 leading-relaxed">{stage.strategy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamComposition;