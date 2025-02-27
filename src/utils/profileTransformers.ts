
/**
 * Utilitaires pour transformer les données de profil
 */
import { UserProfile, Experience } from "@/types/profile";

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
    updated_at: profileData.updated_at,
    
    // Propriétés additionnelles
    website: profileData.website,
    company_name: profileData.company_name,
    privacy_enabled: profileData.privacy_enabled,
    verified: profileData.verified,
    latitude: profileData.latitude,
    longitude: profileData.longitude,
    experiences: profileData.experiences || [],
    education: profileData.education || [],
    certifications: profileData.certifications || [],
    friends: profileData.friends || [],
    sections_order: profileData.sections_order
  } as UserProfile;
}

/**
 * Transforme des données brutes d'expérience en objet Experience structuré
 */
export function transformToExperience(experienceData: any): Experience {
  return {
    id: experienceData.id || '',
    profile_id: experienceData.profile_id || '',
    company: experienceData.company || '',
    position: experienceData.position || '',
    description: experienceData.description || null,
    start_date: experienceData.start_date || null,
    end_date: experienceData.end_date || null,
    created_at: experienceData.created_at || new Date().toISOString(),
    updated_at: experienceData.updated_at || new Date().toISOString()
  };
}
