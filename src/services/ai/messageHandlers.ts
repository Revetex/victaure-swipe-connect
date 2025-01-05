import { WELCOME_MESSAGE, FALLBACK_MESSAGE } from './prompts';
import type { UserProfile } from '@/types/profile';

export const handleWelcomeMessage = () => {
  return WELCOME_MESSAGE;
};

export const handleFallbackMessage = () => {
  return FALLBACK_MESSAGE;
};

export const formatUserProfile = (profile: UserProfile | null) => {
  return {
    role: profile?.role || 'professionnel de la construction',
    skills: profile?.skills?.join(', ') || 'non spécifiées',
    city: profile?.city || 'non spécifiée',
    state: profile?.state || 'Québec',
    country: profile?.country || 'Canada'
  };
};

export const validateProfileUpdate = (currentProfile: UserProfile, updates: Partial<UserProfile>) => {
  // Validate critical fields
  if (updates.role && !['professional', 'employer', 'admin'].includes(updates.role)) {
    throw new Error('Rôle invalide');
  }

  // Validate location data
  if (updates.city && typeof updates.city !== 'string') {
    throw new Error('Ville invalide');
  }

  if (updates.state && typeof updates.state !== 'string') {
    throw new Error('Province invalide');
  }

  // Validate skills array
  if (updates.skills && !Array.isArray(updates.skills)) {
    throw new Error('Compétences invalides');
  }

  return true;
};