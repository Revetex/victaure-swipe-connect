import { WELCOME_MESSAGE, FALLBACK_MESSAGE } from './config';
import type { UserProfile } from '@/types/profile';
import { supabase } from '@/integrations/supabase/client';

export const handleWelcomeMessage = () => {
  return WELCOME_MESSAGE;
};

export const handleFallbackMessage = () => {
  return FALLBACK_MESSAGE;
};

export const formatUserProfile = (profile: UserProfile | null) => {
  return {
    role: profile?.role || 'professionnel',
    skills: profile?.skills?.join(', ') || 'non spécifiées',
    city: profile?.city || 'non spécifiée',
    state: profile?.state || 'Québec',
    country: profile?.country || 'Canada'
  };
};

export const validateProfileUpdate = async (currentProfile: UserProfile, updates: Partial<UserProfile>) => {
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

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
  return true;
};

export const searchJobs = async (criteria: any) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};