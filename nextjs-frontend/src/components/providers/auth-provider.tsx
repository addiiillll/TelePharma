'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, setLoading } from '@/lib/redux/slices/authSlice';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          dispatch(setCredentials({ doctor: data.doctor }));
        }
      } catch (error) {
        // Silently handle auth verification failure
        // This is expected when user is not logged in or server is down
      } finally {
        dispatch(setLoading(false));
      }
    };

    verifyAuth();
  }, [dispatch]);

  return <>{children}</>;
}