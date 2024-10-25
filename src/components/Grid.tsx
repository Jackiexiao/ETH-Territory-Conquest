import React from 'react';
import { Flag, Coins } from 'lucide-react';

interface Territory {
  owner: string;
  color: string;
  price: number;
  lastClaimed: number;
  yield: number;
}

interface GridProps {
  grid: Territory[][];
  onClaim: (x: number, y: number) => void;
  isLoading: boolean;
  userAddress?: string;
}

export const Grid: React.FC<GridProps> = ({ grid, onClaim, isLoading, userAddress }) => {
  return (
    <div className="grid grid-cols-8 gap-1 p-4 bg-gray-800 rounded-lg shadow-xl">
      {grid.map((row, y) =>
        row.map((territory, x) => {
          const isOwned = territory.owner !== '';
          const isUserOwned = territory.owner === userAddress;

          return (
            <button
              key={`${x}-${y}`}
              onClick={() => !isLoading && onClaim(x, y)}
              disabled={isLoading}
              className={`
                relative w-16 h-16 rounded-md transition-all duration-300
                ${isOwned ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-purple-600'}
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
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                    hidden group-hover:block bg-black/90 text-xs p-1 rounded whitespace-nowrap z-10">
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      <span>{territory.price.toFixed(3)} ETH</span>
                    </div>
                    <div className="text-green-400">
                      +{territory.yield.toFixed(4)} ETH/min
                    </div>
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