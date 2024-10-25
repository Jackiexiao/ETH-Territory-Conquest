import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export const useEthereum = () => {
  const [address, setAddress] = useState<string>();
  const [isConnecting, setIsConnecting] = useState(false);

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
      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return { address, connect, isConnecting };
};