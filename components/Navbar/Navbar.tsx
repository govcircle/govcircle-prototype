
import React, { useState } from 'react';
import { Menu, Search, Bell, Moon, Sun, Wallet, LogOut } from 'lucide-react';
import { Button } from '../Button/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { WalletModal } from '../Modals/WalletModal';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isConnected, connect, disconnect } = useUser();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <>
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
        onConnect={connect}
      />

      <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onMenuClick} className="p-2">
            <Menu size={24} />
          </Button>
          <div className="flex items-center gap-2">
             <img 
                src= {`${import.meta.env.BASE_URL}/assets/govcircle.png`}
                alt="GovCircle" 
                className="w-10 h-10 object-contain"
             />
             <div className="hidden md:block">
               <h1 className="text-xl font-bold tracking-tight text-textPrimary">GovCircle</h1>
               <p className="text-[10px] text-primary uppercase font-bold tracking-wider">From Exclusion to Contribution</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <Button 
            variant="ghost" 
            onClick={toggleTheme} 
            className="rounded-full w-10 h-10 p-0 text-textSecondary hover:text-textPrimary"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={16} />
              <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-surface-primary border border-border rounded-full pl-10 pr-4 py-1.5 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors w-64"
              />
          </div>
          <Button variant="ghost" className="rounded-full w-10 h-10 p-0 hidden sm:flex">
              <Bell size={20} />
          </Button>
          
          {/* Auth Section */}
          {isConnected && user ? (
              <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-surface-primary border border-border rounded-full p-1 pr-3 transition-colors group relative">
                      <div className="w-8 h-8 rounded-full bg-surface-secondary overflow-hidden">
                          <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-xs font-bold text-textPrimary max-w-[100px] truncate">{user.username}</span>
                          <span className="text-[10px] text-textSecondary font-mono">{user.handle}</span>
                      </div>
                      
                      {/* Logout Button (Small, overlaid or separate) - Adding as a separate small button next to it for simplicity */}
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={disconnect}
                    className="h-8 w-8 p-0 rounded-full text-error hover:bg-error/10"
                    title="Disconnect Wallet"
                  >
                      <LogOut size={16} />
                  </Button>
              </div>
          ) : (
             <Button 
                onClick={() => setIsWalletModalOpen(true)}
                className="rounded-full px-4 py-1.5 text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                iconLeft={<Wallet size={16} />}
             >
                Connect Wallet
             </Button>
          )}

        </div>
      </nav>
    </>
  );
};
