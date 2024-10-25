import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  onConnect: () => void;
  address?: string;
  isConnecting: boolean;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  address,
  isConnecting,
}) => {
  return (
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
    >
      <Wallet className="w-5 h-5" />
      {address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : isConnecting
        ? 'Connecting...'
        : 'Connect Wallet'}
    </button>
  );
};