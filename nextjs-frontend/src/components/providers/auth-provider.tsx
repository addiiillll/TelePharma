'use client';

import { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';

const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <AuthContext.Provider value={{ auth, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);