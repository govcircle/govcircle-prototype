
import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (username: string, handle: string, walletName: string) => void;
}

const WALLETS = [
  { name: 'Nami', icon: 'https://www.namiwallet.io/favicon.ico' },
  { name: 'Eternl', icon: 'https://ccvault.io/icons/eternl.png' },
  { name: 'Flint', icon: 'https://flint-wallet.com/favicon.ico' },
  { name: 'Yoroi', icon: 'https://yoroi-wallet.com/assets/favicon.ico' },
  { name: 'Typhon', icon: 'https://typhonwallet.io/assets/images/logo.svg' }
];

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [handle, setHandle] = useState('');

  if (!isOpen) return null;

  const handleConnectClick = () => {
    if (selectedWallet) {
      onConnect(username, handle, selectedWallet);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-surface-primary border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-textPrimary flex items-center gap-2">
            <Wallet className="text-primary" size={24} />
            Connect Wallet
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-textSecondary hover:text-textPrimary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
            
            {/* Step 1: Choose Wallet */}
            <div>
                <h3 className="text-sm font-bold text-textSecondary uppercase tracking-wider mb-3">1. Select Wallet</h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {WALLETS.map((w) => (
                        <button
                            key={w.name}
                            onClick={() => setSelectedWallet(w.name)}
                            className={`
                                flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200
                                ${selectedWallet === w.name 
                                    ? 'bg-primary/10 border-primary shadow-[0_0_0_2px_rgba(var(--color-primary)/0.5)]' 
                                    : 'bg-surface-secondary border-border hover:bg-surface-secondary/80 hover:border-primary/50'
                                }
                            `}
                        >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden p-1">
                                {/* Fallback icon if image fails (using simple div) */}
                                <div className="w-full h-full bg-slate-200 rounded-full" />
                            </div>
                            <span className={`text-xs font-bold ${selectedWallet === w.name ? 'text-primary' : 'text-textSecondary'}`}>
                                {w.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Step 2: User Details */}
            <div className={`transition-all duration-300 ${selectedWallet ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                 <h3 className="text-sm font-bold text-textSecondary uppercase tracking-wider mb-3">2. Identity (Optional)</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                         <label className="block text-xs font-medium text-textSecondary mb-1">Display Name</label>
                         <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="govcircle user"
                            className="w-full bg-surface-secondary border border-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:border-primary focus:outline-none"
                         />
                     </div>
                     <div>
                         <label className="block text-xs font-medium text-textSecondary mb-1">Handle</label>
                         <input 
                            type="text" 
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="govcircle_user"
                            className="w-full bg-surface-secondary border border-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:border-primary focus:outline-none"
                         />
                     </div>
                 </div>
                 <p className="text-[10px] text-textSecondary mt-2 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-success" />
                    Defaults will be applied if left blank.
                 </p>
            </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-surface-secondary/50 flex justify-end">
            <button
                onClick={handleConnectClick}
                disabled={!selectedWallet}
                className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all
                    ${selectedWallet 
                        ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20' 
                        : 'bg-border cursor-not-allowed text-textSecondary'
                    }
                `}
            >
                Connect & Enter
                <ArrowRight size={16} />
            </button>
        </div>

      </div>
    </div>
  );
};
