import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  onConnect: () => void;
  address?: string;
  balance?: number;
  isConnecting: boolean;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  address,
  balance,
  isConnecting,
}) => {
  return (
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg 
        hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-lg"
    >
      <Wallet className="w-5 h-5" />
      {address ? (
        <div className="flex items-center gap-4">
          <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
          <span className="text-sm text-purple-200">
            {balance?.toFixed(4)} ETH
          </span>
        </div>
      ) : (
        isConnecting ? 'Connecting...' : 'Connect Wallet'
      )}
    </button>
  );
};