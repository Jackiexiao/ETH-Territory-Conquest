import React, { useState, useCallback, useEffect } from 'react';
import { Grid } from './components/Grid';
import { WalletConnect } from './components/WalletConnect';
import { GameStats } from './components/GameStats';
import { useEthereum } from './hooks/useEthereum';
import toast, { Toaster } from 'react-hot-toast';
import { Sword, Crown, Sparkles } from 'lucide-react';

interface Territory {
  owner: string;
  color: string;
  price: number;
  lastClaimed: number;
  yield: number;
  level: number;
  powerups: string[];
}

const INITIAL_PRICE = 0.01;
const PRICE_INCREASE = 1.5;
const BASE_YIELD = 0.001;
const POWERUP_COST = 0.05;
const UPGRADE_COST = 0.1;

const POWERUPS = {
  DOUBLE_YIELD: '2x Yield',
  SHIELD: 'Shield',
  BONUS: 'Bonus',
};

function App() {
  const { address, connect, isConnecting, balance, getBalance } = useEthereum();
  const [grid, setGrid] = useState<Territory[][]>(
    Array(8).fill(null).map(() =>
      Array(8).fill(null).map(() => ({
        owner: '',
        color: '',
        price: INITIAL_PRICE,
        lastClaimed: 0,
        yield: BASE_YIELD,
        level: 1,
        powerups: []
      }))
    )
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{[key: string]: number}>({});
  const [selectedTerritory, setSelectedTerritory] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!address) return;

      setGrid(prevGrid => {
        const newGrid = [...prevGrid.map(row => [...row])];
        let totalYield = 0;

        newGrid.forEach((row, y) => {
          row.forEach((territory, x) => {
            if (territory.owner === address) {
              const timePassed = (Date.now() - territory.lastClaimed) / (1000 * 60);
              let yieldMultiplier = territory.level;
              if (territory.powerups.includes(POWERUPS.DOUBLE_YIELD)) {
                yieldMultiplier *= 2;
              }
              if (territory.powerups.includes(POWERUPS.BONUS)) {
                yieldMultiplier *= 1.5;
              }
              totalYield += territory.yield * timePassed * yieldMultiplier;
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
    }, 60000);

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

      if (territory.owner && territory.powerups.includes(POWERUPS.SHIELD)) {
        toast.error('This territory is protected by a shield!');
        return;
      }

      setIsProcessing(true);
      try {
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
            yield: BASE_YIELD * (1 + (x + y) / 8),
            level: 1,
            powerups: []
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

  const handleUpgrade = useCallback(async () => {
    if (!selectedTerritory || !address) return;
    const { x, y } = selectedTerritory;
    const territory = grid[y][x];
    
    if (territory.owner !== address) {
      toast.error('You can only upgrade your own territories!');
      return;
    }

    if ((balance || 0) < UPGRADE_COST) {
      toast.error('Insufficient funds for upgrade!');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGrid(prev => {
        const newGrid = [...prev.map(row => [...row])];
        newGrid[y][x] = {
          ...territory,
          level: territory.level + 1,
          yield: territory.yield * 1.5
        };
        return newGrid;
      });

      await getBalance();
      toast.success(`Territory upgraded to level ${territory.level + 1}!`);
    } catch (error) {
      toast.error('Failed to upgrade territory');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedTerritory, address, balance, getBalance, grid]);

  const handlePowerup = useCallback(async (powerup: string) => {
    if (!selectedTerritory || !address) return;
    const { x, y } = selectedTerritory;
    const territory = grid[y][x];
    
    if (territory.owner !== address) {
      toast.error('You can only add powerups to your own territories!');
      return;
    }

    if ((balance || 0) < POWERUP_COST) {
      toast.error('Insufficient funds for powerup!');
      return;
    }

    if (territory.powerups.includes(powerup)) {
      toast.error('This powerup is already active!');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGrid(prev => {
        const newGrid = [...prev.map(row => [...row])];
        newGrid[y][x] = {
          ...territory,
          powerups: [...territory.powerups, powerup]
        };
        return newGrid;
      });

      await getBalance();
      toast.success(`Powerup ${powerup} added successfully!`);
    } catch (error) {
      toast.error('Failed to add powerup');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedTerritory, address, balance, getBalance, grid]);

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

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm shadow-2xl">
              <Grid
                grid={grid}
                onClaim={handleClaim}
                isLoading={isProcessing}
                userAddress={address}
                selectedTerritory={selectedTerritory}
                onSelectTerritory={setSelectedTerritory}
              />
            </div>

            {selectedTerritory && (
              <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm shadow-2xl w-64">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Territory Actions
                </h3>
                
                <div className="space-y-4">
                  <button
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 
                      transition-colors disabled:opacity-50"
                  >
                    Upgrade ({UPGRADE_COST} ETH)
                  </button>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Powerups ({POWERUP_COST} ETH each):</h4>
                    {Object.values(POWERUPS).map(powerup => (
                      <button
                        key={powerup}
                        onClick={() => handlePowerup(powerup)}
                        disabled={isProcessing}
                        className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 
                          transition-colors disabled:opacity-50"
                      >
                        Add {powerup}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-gray-400 max-w-md">
            <p className="text-lg">Claim and earn ETH from territories!</p>
            <ul className="mt-4 text-sm space-y-2">
              <li>• Each territory generates ETH yield over time</li>
              <li>• Upgrade territories to increase their yield</li>
              <li>• Add powerups for special effects:</li>
              <li className="pl-4">- 2x Yield: Double your earnings</li>
              <li className="pl-4">- Shield: Protect from takeovers</li>
              <li className="pl-4">- Bonus: +50% yield boost</li>
            </ul>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;