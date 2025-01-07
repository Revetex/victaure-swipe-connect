import { useAuthState } from './auth/useAuthState';
import { useAuthHandlers } from './auth/useAuthHandlers';
import { useAuthSession } from './auth/useAuthSession';

export function useAuth() {
  const { state, setState } = useAuthState();
  const { signOut } = useAuthHandlers(setState);
  
  useAuthSession(state, setState);

  return { 
    ...state,
    signOut
  };
}