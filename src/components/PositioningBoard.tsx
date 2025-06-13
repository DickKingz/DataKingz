import React from 'react';
import { Champion } from '../types';

interface PositioningBoardProps {
  champions: { champion: Champion; position: { row: number; col: number } }[];
  isInteractive?: boolean;
  onPositionClick?: (row: number, col: number) => void;
  selectedPosition?: { row: number; col: number } | null;
  size?: 'small' | 'medium' | 'large';
}

const PositioningBoard: React.FC<PositioningBoardProps> = ({ 
  champions, 
  isInteractive = false, 
  onPositionClick,
  selectedPosition,
  size = 'medium'
}) => {
  // Create a 4x7 board like in the actual game
  const board = Array(4).fill(null).map(() => Array(7).fill(null));
  
  // Place champions on the board
  champions.forEach(({ champion, position }) => {
    if (position.row < 4 && position.col < 7) {
      board[position.row][position.col] = champion;
    }
  });

  const sizeClasses = {
    small: { hex: 'w-12 h-12', text: 'text-xs', container: 'gap-1 max-w-md' },
    medium: { hex: 'w-16 h-16', text: 'text-sm', container: 'gap-2 max-w-2xl' },
    large: { hex: 'w-20 h-20', text: 'text-base', container: 'gap-3 max-w-4xl' }
  };

  const currentSize = sizeClasses[size];

  // Offset pattern for hexagonal layout (like in actual TFT/Illuvium)
  const getRowOffset = (rowIndex: number) => {
    return rowIndex % 2 === 1 ? 'translate-x-8' : '';
  };

  // Hexagon clip path for perfect hexagonal shape
  const hexagonClipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

  return (
    <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden">
      {/* Enhanced Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-blue-500/20 rounded-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
        
        {/* Hexagonal grid pattern background */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <polygon points="30,2 52,15 52,37 30,50 8,37 8,15" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" className="text-cyan-400/20"/>
          </svg>
        </div>
      </div>
      
      <div className="relative z-10">
        {/* Enemy side label */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-3 backdrop-blur-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-bold text-lg">ENEMY SIDE</span>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Game board with hexagonal layout */}
        <div className={`${currentSize.container} mx-auto mb-8`}>
          {board.map((row, rowIdx) => (
            <div 
              key={rowIdx} 
              className={`flex justify-center items-center gap-3 ${getRowOffset(rowIdx)} mb-3`}
            >
              {row.map((champion, colIdx) => {
                const isSelected = selectedPosition?.row === rowIdx && selectedPosition?.col === colIdx;
                const hasChampion = !!champion;
                
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`relative ${currentSize.hex} transition-all duration-300 flex items-center justify-center ${
                      isInteractive ? 'cursor-pointer' : ''
                    } ${
                      hasChampion
                        ? 'transform hover:scale-110 z-10'
                        : isSelected
                        ? 'transform scale-110 z-10'
                        : isInteractive
                        ? 'hover:scale-105'
                        : ''
                    }`}
                    onClick={() => isInteractive && onPositionClick?.(rowIdx, colIdx)}
                  >
                    {/* Main Hexagon */}
                    <div
                      className={`w-full h-full transition-all duration-300 flex items-center justify-center relative ${
                        hasChampion
                          ? 'bg-gradient-to-br from-cyan-400/90 via-blue-500/90 to-purple-600/90 shadow-lg shadow-cyan-400/50'
                          : isSelected
                          ? 'bg-gradient-to-br from-yellow-400/90 via-orange-500/90 to-red-500/90 shadow-lg shadow-yellow-400/50'
                          : 'bg-gradient-to-br from-slate-700/60 via-slate-600/40 to-slate-700/60 hover:from-slate-600/70 hover:via-slate-500/50 hover:to-slate-600/70 hover:shadow-md hover:shadow-cyan-400/30'
                      }`}
                      style={{ clipPath: hexagonClipPath }}
                    >
                      {/* Inner glow effect */}
                      <div 
                        className={`absolute inset-1 ${
                          hasChampion
                            ? 'bg-gradient-to-br from-cyan-300/20 via-blue-400/20 to-purple-500/20'
                            : isSelected
                            ? 'bg-gradient-to-br from-yellow-300/20 via-orange-400/20 to-red-400/20'
                            : 'bg-gradient-to-br from-slate-600/20 to-slate-500/20'
                        }`}
                        style={{ clipPath: hexagonClipPath }}
                      />
                      
                      {/* Champion content */}
                      {champion && (
                        <div className={`relative z-10 text-white font-bold text-center drop-shadow-lg ${currentSize.text}`}>
                          <div className="flex flex-col items-center">
                            <div className="font-black">
                              {size === 'small' ? champion.name[0] : champion.name.substring(0, 3)}
                            </div>
                            {size !== 'small' && (
                              <div className="text-xs opacity-80 font-medium">
                                {champion.cost}★
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Selection indicator */}
                      {isSelected && !hasChampion && (
                        <div className={`relative z-10 text-white font-bold text-center ${currentSize.text}`}>
                          <div className="text-2xl">+</div>
                        </div>
                      )}

                      {/* Border highlight */}
                      <div 
                        className={`absolute inset-0 border-2 transition-all duration-300 ${
                          hasChampion
                            ? 'border-cyan-300/80'
                            : isSelected
                            ? 'border-yellow-300/80'
                            : 'border-slate-500/50 hover:border-cyan-400/50'
                        }`}
                        style={{ clipPath: hexagonClipPath }}
                      />
                    </div>
                    
                    {/* Hover glow effect */}
                    {isInteractive && (
                      <div 
                        className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                          hasChampion
                            ? 'bg-cyan-400/20 shadow-lg shadow-cyan-400/40'
                            : 'bg-purple-400/20 shadow-lg shadow-purple-400/40'
                        }`}
                        style={{ clipPath: hexagonClipPath }}
                      />
                    )}

                    {/* Connection lines to adjacent hexagons */}
                    {hasChampion && (
                      <>
                        {/* Right connection */}
                        {colIdx < 6 && board[rowIdx][colIdx + 1] && (
                          <div className="absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-cyan-400/60 to-transparent transform -translate-y-1/2 z-0" />
                        )}
                        {/* Bottom-right connection (for odd rows) */}
                        {rowIdx % 2 === 1 && rowIdx < 3 && colIdx < 6 && board[rowIdx + 1] && board[rowIdx + 1][colIdx + 1] && (
                          <div className="absolute bottom-0 -right-2 w-4 h-4 border-r border-b border-cyan-400/40 transform rotate-45 translate-y-2 translate-x-1 z-0" />
                        )}
                        {/* Bottom-left connection (for even rows) */}
                        {rowIdx % 2 === 0 && rowIdx < 3 && colIdx > 0 && board[rowIdx + 1] && board[rowIdx + 1][colIdx - 1] && (
                          <div className="absolute bottom-0 -left-2 w-4 h-4 border-l border-b border-cyan-400/40 transform -rotate-45 translate-y-2 -translate-x-1 z-0" />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Player side label */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-6 py-3 backdrop-blur-sm">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-cyan-400 font-bold text-lg">YOUR SIDE</span>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Enhanced corner decorative elements */}
      <div className="absolute top-4 left-4 w-4 h-4 bg-cyan-400/50 rounded-full animate-pulse" style={{ clipPath: hexagonClipPath }} />
      <div className="absolute top-4 right-4 w-4 h-4 bg-purple-400/50 rounded-full animate-pulse" style={{ clipPath: hexagonClipPath }} />
      <div className="absolute bottom-4 left-4 w-4 h-4 bg-blue-400/50 rounded-full animate-pulse" style={{ clipPath: hexagonClipPath }} />
      <div className="absolute bottom-4 right-4 w-4 h-4 bg-cyan-400/50 rounded-full animate-pulse" style={{ clipPath: hexagonClipPath }} />

      {/* Floating particles for ambiance */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-bounce opacity-60"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default PositioningBoard;