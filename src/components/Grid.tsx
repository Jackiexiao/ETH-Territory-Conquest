import React from 'react';
import { Flag } from 'lucide-react';

interface GridProps {
  grid: string[][];
  onClaim: (x: number, y: number) => void;
  isLoading: boolean;
}

export const Grid: React.FC<GridProps> = ({ grid, onClaim, isLoading }) => {
  return (
    <div className="grid grid-cols-8 gap-1 p-4 bg-gray-800 rounded-lg shadow-xl">
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <button
            key={`${x}-${y}`}
            onClick={() => !isLoading && onClaim(x, y)}
            disabled={isLoading || cell !== ''}
            className={`
              w-16 h-16 rounded-md transition-all duration-300
              ${cell ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-purple-600'}
              ${
                cell
                  ? `bg-${cell.toLowerCase()}-500`
                  : 'bg-gray-700 hover:shadow-lg transform hover:-translate-y-1'
              }
            `}
          >
            {cell && (
              <div className="flex items-center justify-center">
                <Flag className="w-6 h-6 text-white" />
              </div>
            )}
          </button>
        ))
      )}
    </div>
  );
};