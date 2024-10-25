import React from 'react';
import { Trophy, Coins } from 'lucide-react';

interface GameStatsProps {
  address?: string;
  balance?: number;
  leaderboard: {[key: string]: number};
}

export const GameStats: React.FC<GameStatsProps> = ({ address, balance, leaderboard }) => {
  const sortedLeaders = Object.entries(leaderboard)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Top Earners
            </h3>
            <div className="space-y-2">
              {sortedLeaders.map(([addr, earnings], index) => (
                <div key={addr} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">#{index + 1}</span>
                    <span className={addr === address ? 'text-yellow-400' : ''}>
                      {addr.slice(0, 6)}...{addr.slice(-4)}
                    </span>
                  </div>
                  <span className="text-green-400">{earnings.toFixed(4)} ETH</span>
                </div>
              ))}
            </div>
          </div>

          {address && (
            <div className="flex-1 border-l border-gray-700 pl-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Coins className="w-5 h-5 text-green-400" />
                Your Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Balance:</span>
                  <span>{balance?.toFixed(4) || '0'} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Earned:</span>
                  <span className="text-green-400">
                    {(leaderboard[address] || 0).toFixed(4)} ETH
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};