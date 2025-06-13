import React, { useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Plus, Users } from 'lucide-react';
import { TeamComposition } from '../types';

interface CompsTierListProps {
  compositions: TeamComposition[];
  onSelectComp: (compId: string) => void;
  onShowBuilder: () => void;
  onShowCommunity: () => void;
}

const CompsTierList: React.FC<CompsTierListProps> = ({ 
  compositions, 
  onSelectComp, 
  onShowBuilder, 
  onShowCommunity 
}) => {
  const [tierComps, setTierComps] = useState<{[key: string]: TeamComposition[]}>({
    S: compositions.filter(comp => comp.tier === 'S'),
    A: compositions.filter(comp => comp.tier === 'A'),
    B: compositions.filter(comp => comp.tier === 'B'),
    C: compositions.filter(comp => comp.tier === 'C'),
  });

  const moveComp = (compId: string, targetTier: string) => {
    setTierComps(prev => {
      const newTierComps = { ...prev };
      
      // Remove comp from all tiers
      Object.keys(newTierComps).forEach(tier => {
        newTierComps[tier] = newTierComps[tier].filter(comp => comp.id !== compId);
      });
      
      // Find the comp and add to target tier
      const comp = compositions.find(c => c.id === compId);
      if (comp) {
        newTierComps[targetTier] = [...newTierComps[targetTier], { ...comp, tier: targetTier as any }];
      }
      
      return newTierComps;
    });
  };

  const tierConfigs = [
    { 
      tier: 'S', 
      color: 'bg-red-600', 
      borderColor: 'border-red-600',
      textColor: 'text-red-600'
    },
    { 
      tier: 'A', 
      color: 'bg-orange-500', 
      borderColor: 'border-orange-500',
      textColor: 'text-orange-500'
    },
    { 
      tier: 'B', 
      color: 'bg-yellow-500', 
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-500'
    },
    { 
      tier: 'C', 
      color: 'bg-green-500', 
      borderColor: 'border-green-500',
      textColor: 'text-green-500'
    },
  ];

  const CompCard: React.FC<{ comp: TeamComposition }> = ({ comp }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'composition',
      item: { id: comp.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`group relative bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
        }`}
        onClick={() => onSelectComp(comp.id)}
      >
        <div className="p-4">
          {/* Header with tier badge and title */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg ${
              comp.tier === 'S' ? 'bg-red-600' :
              comp.tier === 'A' ? 'bg-orange-500' :
              comp.tier === 'B' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}>
              {comp.tier}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">{comp.name}</h3>
              <p className="text-gray-400 text-xs truncate">{comp.playstyle}</p>
            </div>
          </div>
          
          {/* Champions grid */}
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {comp.champions.slice(0, 8).map((champion, idx) => (
              <div
                key={idx}
                className="aspect-square bg-gray-700 rounded border border-gray-600 flex items-center justify-center text-xs text-white font-medium hover:bg-gray-600 transition-colors"
              >
                {champion.name[0]}
              </div>
            ))}
          </div>

          {/* Difficulty stars */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx < comp.difficulty.length ? 'bg-yellow-400' : 'bg-gray-600'
                }`}
              />
            ))}
            <span className="text-gray-400 text-xs ml-2">Difficulty</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  };

  const TierRow: React.FC<{ 
    tier: string; 
    color: string; 
    borderColor: string;
    textColor: string;
    comps: TeamComposition[] 
  }> = ({ tier, color, borderColor, textColor, comps }) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'composition',
      drop: (item: { id: string }) => moveComp(item.id, tier),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div className="mb-4">
        {/* Tier Header */}
        <div className={`${color} rounded-t-2xl px-6 py-4 flex items-center justify-center relative`}>
          {/* Decorative elements */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-black bg-opacity-30 transform rotate-45"></div>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-black bg-opacity-30 transform rotate-45"></div>
          </div>
          
          {/* Tier Label */}
          <div className="flex items-center gap-4">
            <span className="text-white text-6xl font-black tracking-wider drop-shadow-lg">
              {tier}
            </span>
            <span className="text-white text-xl font-bold opacity-90">
              TIER
            </span>
          </div>
          
          {/* Top decorative shapes */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-black bg-opacity-30 transform rotate-45"></div>
          </div>
        </div>
        
        {/* Tier Content */}
        <div
          ref={drop}
          className={`bg-gray-900 border-l-4 border-r-4 border-b-4 ${borderColor} rounded-b-2xl p-6 min-h-[200px] transition-all duration-300 ${
            isOver ? 'bg-gray-800 ring-2 ring-purple-500' : ''
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {comps.map((comp) => (
              <CompCard key={comp.id} comp={comp} />
            ))}
          </div>
          
          {/* Empty state */}
          {comps.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 text-lg font-medium">Drop compositions here</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={onShowCommunity}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
        >
          <Users className="w-5 h-5" />
          Community Submissions
        </button>
        <button
          onClick={onShowBuilder}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Build New Comp
        </button>
      </div>

      {/* Tier List */}
      <div className="space-y-0">
        {tierConfigs.map(({ tier, color, borderColor, textColor }) => (
          <TierRow 
            key={tier}
            tier={tier} 
            color={color} 
            borderColor={borderColor}
            textColor={textColor}
            comps={tierComps[tier]} 
          />
        ))}
      </div>
    </div>
  );
};

export default CompsTierList;