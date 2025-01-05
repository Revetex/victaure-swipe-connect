import { WELCOME_MESSAGE, FALLBACK_MESSAGE } from './prompts';

export const handleWelcomeMessage = () => {
  return WELCOME_MESSAGE;
};

export const handleFallbackMessage = () => {
  return FALLBACK_MESSAGE;
};

export const formatUserProfile = (profile: any) => {
  return {
    role: profile?.role || 'non spécifié',
    skills: profile?.skills?.join(', ') || 'non spécifiées',
    city: profile?.city || 'non spécifiée',
    state: profile?.state || 'non spécifié',
    country: profile?.country || 'Canada'
  };
};