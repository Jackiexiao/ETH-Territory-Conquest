import React from 'react';
import { Flag, Coins, Shield, Zap } from 'lucide-react';

interface Territory {
  owner: string;
  color: string;
  price: number;
  lastClaimed: number;
  yield: number;
  level: number;
  powerups: string[];
}

interface GridProps {
  grid: Territory[][];
  onClaim: (x: number, y: number) => void;
  isLoading: boolean;
  userAddress?: string;
  selectedTerritory: { x: number; y: number } | null;
  onSelectTerritory: (coords: { x: number; y: number } | null) => void;
}

export const Grid: React.FC<GridProps> = ({
  grid,
  onClaim,
  isLoading,
  userAddress,
  selectedTerritory,
  onSelectTerritory,
}) => {
  return (
    <div className="grid grid-cols-8 gap-1 p-4 bg-gray-800 rounded-lg shadow-xl">
      {grid.map((row, y) =>
        row.map((territory, x) => {
          const isOwned = territory.owner !== '';
          const isUserOwned = territory.owner === userAddress;
          const isSelected = selectedTerritory?.x === x && selectedTerritory?.y === y;

          return (
            <button
              key={`${x}-${y}`}
              onClick={() => {
                if (isLoading) return;
                if (isUserOwned) {
                  onSelectTerritory(isSelected ? null : { x, y });
                } else {
                  onClaim(x, y);
                }
              }}
              disabled={isLoading}
              className={`
                relative w-16 h-16 rounded-md transition-all duration-300
                ${isOwned ? (isUserOwned ? 'cursor-pointer' : 'cursor-not-allowed') : 'cursor-pointer hover:bg-purple-600'}
                ${isSelected ? 'ring-4 ring-yellow-400' : ''}
                ${
                  isOwned
                    ? `bg-${territory.color}-500 ${isUserOwned ? 'ring-2 ring-yellow-400' : ''}`
                    : 'bg-gray-700 hover:shadow-lg transform hover:-translate-y-1'
                }
                group
              `}
            >
              {isOwned && (
                <div className="flex flex-col items-center justify-center">
                  <Flag className="w-6 h-6 text-white" />
                  {territory.powerups.includes('Shield') && (
                    <Shield className="absolute top-1 right-1 w-4 h-4 text-blue-300" />
                  )}
                  {territory.level > 1 && (
                    <span className="absolute top-1 left-1 text-xs font-bold bg-yellow-400 text-black rounded-full w-4 h-4 flex items-center justify-center">
                      {territory.level}
                    </span>
                  )}
                  {territory.powerups.includes('2x Yield') && (
                    <Zap className="absolute bottom-1 right-1 w-4 h-4 text-yellow-300" />
                  )}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                    hidden group-hover:block bg-black/90 text-xs p-1 rounded whitespace-nowrap z-10">
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      <span>{territory.price.toFixed(3)} ETH</span>
                    </div>
                    <div className="text-green-400">
                      +{(territory.yield * (territory.powerups.includes('2x Yield') ? 2 : 1)).toFixed(4)} ETH/min
                    </div>
                    {territory.powerups.length > 0 && (
                      <div className="text-blue-300 text-[10px]">
                        {territory.powerups.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!isOwned && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                  hidden group-hover:block bg-black/90 text-xs p-1 rounded whitespace-nowrap">
                  {territory.price.toFixed(3)} ETH
                </div>
              )}
            </button>
          );
        })
      )}
    </div>
  );
};