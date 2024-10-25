import React, { useState, useCallback } from 'react';
import { Grid } from './components/Grid';
import { WalletConnect } from './components/WalletConnect';
import { useEthereum } from './hooks/useEthereum';
import toast, { Toaster } from 'react-hot-toast';
import { Sword } from 'lucide-react';

const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];

function App() {
  const { address, connect, isConnecting } = useEthereum();
  const [grid, setGrid] = useState<string[][]>(Array(8).fill(Array(8).fill('')));
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClaim = useCallback(
    async (x: number, y: number) => {
      if (!address) {
        toast.error('Please connect your wallet first!');
        return;
      }

      setIsProcessing(true);
      try {
        // Simulate blockchain transaction
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        setGrid((prev) => {
          const newGrid = prev.map((row) => [...row]);
          newGrid[y][x] = color;
          return newGrid;
        });
        
        toast.success('Territory claimed successfully!');
      } catch (error) {
        console.error('Claim error:', error);
        toast.error('Failed to claim territory');
      } finally {
        setIsProcessing(false);
      }
    },
    [address]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <Sword className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              ETH Territory Conquest
            </h1>
          </div>
          
          <WalletConnect
            onConnect={connect}
            address={address}
            isConnecting={isConnecting}
          />

          <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm">
            <Grid
              grid={grid}
              onClaim={handleClaim}
              isLoading={isProcessing || isConnecting}
            />
          </div>

          <div className="text-center text-gray-400">
            <p>Claim territories on the Ethereum blockchain!</p>
            <p className="text-sm mt-2">Gas fees apply for each claim</p>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;