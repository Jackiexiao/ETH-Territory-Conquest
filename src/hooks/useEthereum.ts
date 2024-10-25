import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export const useEthereum = () => {
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState<number>();
  const [isConnecting, setIsConnecting] = useState(false);

  const getBalance = useCallback(async () => {
    if (!window.ethereum || !address) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(Number(ethers.formatEther(balance)));
    } catch (error) {
      console.error('Balance error:', error);
    }
  }, [address]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to play!');
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      
      // Get initial balance
      const balance = await provider.getBalance(address);
      setBalance(Number(ethers.formatEther(balance)));

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(undefined);
          setBalance(undefined);
        } else {
          setAddress(accounts[0]);
          getBalance();
        }
      });

      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [getBalance]);

  return { address, balance, connect, isConnecting, getBalance };
};