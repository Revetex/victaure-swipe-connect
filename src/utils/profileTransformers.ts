
/**
 * Transforme un profil brut depuis la base de données en un format exploitable
 */
export function transformToFullProfile(rawProfile: any) {
  if (!rawProfile) return null;
  
  return {
    id: rawProfile.id || '',
    full_name: rawProfile.full_name || '',
    avatar_url: rawProfile.avatar_url || null,
    email: rawProfile.email || null,
    role: rawProfile.role || 'professional',
    bio: rawProfile.bio || null,
    skills: Array.isArray(rawProfile.skills) ? rawProfile.skills : [],
    certifications: Array.isArray(rawProfile.certifications) ? rawProfile.certifications : [],
    education: Array.isArray(rawProfile.education) ? rawProfile.education : [],
    experiences: Array.isArray(rawProfile.experiences) ? rawProfile.experiences : [],
    online_status: typeof rawProfile.online_status === 'boolean' 
      ? rawProfile.online_status 
      : rawProfile.online_status === 'online'
  };
}
