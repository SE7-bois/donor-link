import { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './wallet.css';

export const WalletButton: FC = () => {
  return (
    <div className="wallet-button-container" style={{ position: 'relative', zIndex: 1000 }}>
      <WalletMultiButton />
    </div>
  );
}; 