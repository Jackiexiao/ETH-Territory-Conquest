import React, { useState, useCallback, useEffect } from 'react';
import { Grid } from './components/Grid';
import { WalletConnect } from './components/WalletConnect';
import { GameStats } from './components/GameStats';
import { useEthereum } from './hooks/useEthereum';
import toast, { Toaster } from 'react-hot-toast';
import { Sword, Crown } from 'lucide-react';

interface Territory {
  owner: string;
  color: string;
  price: number;
  lastClaimed: number;
  yield: number;
}

const INITIAL_PRICE = 0.01; // Initial price in ETH
const PRICE_INCREASE = 1.5; // Price multiplier for each claim
const BASE_YIELD = 0.001; // Base yield in ETH per minute

function App() {
  const { address, connect, isConnecting, balance, getBalance } = useEthereum();
  const [grid, setGrid] = useState<Territory[][]>(
    Array(8).fill(null).map(() =>
      Array(8).fill(null).map(() => ({
        owner: '',
        color: '',
        price: INITIAL_PRICE,
        lastClaimed: 0,
        yield: BASE_YIELD
      }))
    )
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{[key: string]: number}>({});

  // Calculate yields every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (!address) return;

      setGrid(prevGrid => {
        const newGrid = [...prevGrid.map(row => [...row])];
        let totalYield = 0;

        newGrid.forEach((row, y) => {
          row.forEach((territory, x) => {
            if (territory.owner === address) {
              const timePassed = (Date.now() - territory.lastClaimed) / (1000 * 60); // minutes
              totalYield += territory.yield * timePassed;
              territory.lastClaimed = Date.now();
            }
          });
        });

        if (totalYield > 0) {
          setLeaderboard(prev => ({
            ...prev,
            [address]: (prev[address] || 0) + totalYield
          }));
          toast.success(`Earned ${totalYield.toFixed(4)} ETH from your territories!`);
        }

        return newGrid;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [address]);

  const handleClaim = useCallback(
    async (x: number, y: number) => {
      if (!address) {
        toast.error('Please connect your wallet first!');
        return;
      }

      const territory = grid[y][x];
      if (territory.owner && territory.price > (balance || 0)) {
        toast.error('Insufficient funds to claim this territory!');
        return;
      }

      setIsProcessing(true);
      try {
        // Simulate blockchain transaction
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setGrid(prev => {
          const newGrid = prev.map(row => [...row]);
          const colors = ['purple', 'pink', 'blue', 'green', 'yellow', 'orange'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          newGrid[y][x] = {
            owner: address,
            color,
            price: territory.price * PRICE_INCREASE,
            lastClaimed: Date.now(),
            yield: BASE_YIELD * (1 + (x + y) / 8) // Territories further from origin yield more
          };
          
          return newGrid;
        });

        await getBalance();
        toast.success('Territory claimed successfully!');
      } catch (error) {
        console.error('Claim error:', error);
        toast.error('Failed to claim territory');
      } finally {
        setIsProcessing(false);
      }
    },
    [address, balance, getBalance, grid]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <Crown className="w-10 h-10 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              ETH Territory Conquest
            </h1>
            <Sword className="w-8 h-8 text-purple-400" />
          </div>

          <GameStats
            address={address}
            balance={balance}
            leaderboard={leaderboard}
          />
          
          <WalletConnect
            onConnect={connect}
            address={address}
            balance={balance}
            isConnecting={isConnecting}
          />

          <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm shadow-2xl">
            <Grid
              grid={grid}
              onClaim={handleClaim}
              isLoading={isProcessing || isConnecting}
              userAddress={address}
            />
          </div>

          <div className="text-center text-gray-400 max-w-md">
            <p className="text-lg">Claim and earn ETH from territories!</p>
            <ul className="mt-4 text-sm space-y-2">
              <li>• Each territory generates ETH yield over time</li>
              <li>• Territories further from origin (0,0) yield more ETH</li>
              <li>• Territory prices increase after each claim</li>
              <li>• Build strategic patterns to maximize earnings</li>
            </ul>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;