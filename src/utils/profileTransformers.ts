
/**
 * Utilitaires pour transformer les données de profil
 */
import { UserProfile } from "@/types/profile";

/**
 * Transforme un profil brut de la base de données en profil complet
 */
export function transformToFullProfile(profileData: any): UserProfile {
  if (!profileData) return {} as UserProfile;
  
  return {
    id: profileData.id,
    full_name: profileData.full_name || '',
    avatar_url: profileData.avatar_url,
    email: profileData.email,
    role: profileData.role || 'professional',
    bio: profileData.bio,
    phone: profileData.phone,
    city: profileData.city,
    state: profileData.state,
    country: profileData.country || '',
    skills: profileData.skills || [],
    online_status: profileData.online_status || false,
    last_seen: profileData.last_seen,
    created_at: profileData.created_at,
    updated_at: profileData.updated_at
  } as UserProfile;
}
