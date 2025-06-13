import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItem';
import { Augment, Champion, Item } from '../types';

interface TierListProps {
  items: Augment[] | Champion[] | Item[];
  type: 'augments' | 'champions' | 'items';
}

const TierList: React.FC<TierListProps> = ({ items, type }) => {
  const [tierItems, setTierItems] = useState<{[key: string]: any[]}>({
    S: items.filter(item => item.tier === 'S'),
    A: items.filter(item => item.tier === 'A'),
    B: items.filter(item => item.tier === 'B'),
    C: items.filter(item => item.tier === 'C'),
  });

  const moveItem = (itemId: string, targetTier: string) => {
    setTierItems(prev => {
      const newTierItems = { ...prev };
      
      // Remove item from all tiers
      Object.keys(newTierItems).forEach(tier => {
        newTierItems[tier] = newTierItems[tier].filter(item => item.id !== itemId);
      });
      
      // Find the item and add to target tier
      const item = items.find(i => i.id === itemId);
      if (item) {
        newTierItems[targetTier] = [...newTierItems[targetTier], { ...item, tier: targetTier }];
      }
      
      return newTierItems;
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

  const TierRow: React.FC<{ 
    tier: string; 
    color: string; 
    borderColor: string;
    textColor: string;
    items: any[] 
  }> = ({ tier, color, borderColor, textColor, items }) => {
    const [{ isOver }, drop] = useDrop({
      accept: type,
      drop: (item: { id: string }) => moveItem(item.id, tier),
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
          className={`bg-gray-900 border-l-4 border-r-4 border-b-4 ${borderColor} rounded-b-2xl p-6 min-h-[120px] transition-all duration-300 ${
            isOver ? 'bg-gray-800 ring-2 ring-purple-500' : ''
          }`}
        >
          <div className="flex flex-wrap gap-4">
            {items.map((item) => (
              <DraggableItem key={item.id} item={item} type={type} />
            ))}
          </div>
          
          {/* Empty state */}
          {items.length === 0 && (
            <div className="flex items-center justify-center h-16">
              <p className="text-gray-500 text-lg font-medium">Drop {type} here</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-0">
      {tierConfigs.map(({ tier, color, borderColor, textColor }) => (
        <TierRow 
          key={tier}
          tier={tier} 
          color={color} 
          borderColor={borderColor}
          textColor={textColor}
          items={tierItems[tier]} 
        />
      ))}
    </div>
  );
};

export default TierList;