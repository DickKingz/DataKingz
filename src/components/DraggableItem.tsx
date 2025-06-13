import React from 'react';
import { useDrag } from 'react-dnd';
import { Augment, Champion, Item } from '../types';

interface DraggableItemProps {
  item: Augment | Champion | Item;
  type: 'augments' | 'champions' | 'items';
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, type }) => {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getItemInfo = () => {
    if (type === 'champions' && 'cost' in item) {
      return `${item.cost} Cost`;
    }
    if (type === 'augments' && 'type' in item) {
      return item.type.charAt(0).toUpperCase() + item.type.slice(1);
    }
    if (type === 'items' && 'components' in item && item.components) {
      return `${item.components.length} Components`;
    }
    return '';
  };

  return (
    <div
      ref={drag}
      className={`relative group cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
      }`}
    >
      {/* Main item container */}
      <div className="relative w-16 h-16 bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-purple-500 transition-all duration-200 flex items-center justify-center overflow-hidden">
        
        {/* Content */}
        <div className="relative z-10 text-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-white text-sm font-bold">
                {item.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-30 shadow-xl">
        <div className="text-center">
          <span className="text-purple-400 font-semibold block">
            {item.name}
          </span>
          {item.description && (
            <span className="text-gray-300 text-xs block mt-1 max-w-xs">
              {item.description.substring(0, 60)}...
            </span>
          )}
          <span className="text-gray-400 text-xs block mt-1">
            {getItemInfo()}
          </span>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
};

export default DraggableItem;