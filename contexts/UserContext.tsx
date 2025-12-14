
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RoleIdentity } from '../types';

export interface UserProfile {
  username: string;
  handle: string;
  avatar: string;
  walletName?: string;
  roles: RoleIdentity[];
}

interface UserContextType {
  user: UserProfile | null;
  connect: (username: string, handle: string, walletName: string) => void;
  disconnect: () => void;
  isConnected: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const connect = (username: string, handle: string, walletName: string) => {
    const finalUsername = username.trim() || 'govcircle user';
    let finalHandle = handle.trim() || 'govcircle_user';
    
    // Ensure handle starts with $ for style consistency, though not strictly required by logic
    if (!finalHandle.startsWith('$')) {
        finalHandle = '$' + finalHandle;
    }

    // Constant avatar for the connected user
    const constantAvatar = `${import.meta.env.BASE_URL}/assets/govcircle-user-avatar.jpg`;

    setUser({
      username: finalUsername,
      handle: finalHandle,
      avatar: constantAvatar,
      walletName,
      // Default roles for a new standard user
      roles: [{ type: 'DRep', id: 'drep...user' }] 
    });
  };

  const disconnect = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, connect, disconnect, isConnected: !!user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
