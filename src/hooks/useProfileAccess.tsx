
import { useProfile } from './useProfile';

interface ProfilePermissions {
  canPostJobs: boolean;
  canApplyToJobs: boolean;
  canManageEmployees: boolean;
  canViewAnalytics: boolean;
  canManageContracts: boolean;
  canBidOnProjects: boolean;
  canCreatePortfolio: boolean;
  isBusinessProfile: boolean;
  isProfessionalProfile: boolean;
}

export function useProfileAccess(): ProfilePermissions {
  const { profile } = useProfile();

  const isBusinessProfile = profile?.role === 'business';
  const isProfessionalProfile = profile?.role === 'professional';

  return {
    canPostJobs: isBusinessProfile,
    canApplyToJobs: isProfessionalProfile,
    canManageEmployees: isBusinessProfile,
    canViewAnalytics: isBusinessProfile,
    canManageContracts: isBusinessProfile || isProfessionalProfile,
    canBidOnProjects: isProfessionalProfile,
    canCreatePortfolio: isProfessionalProfile,
    isBusinessProfile,
    isProfessionalProfile
  };
}
