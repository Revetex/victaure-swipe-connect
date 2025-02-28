
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
      : rawProfile.online_status === 'online',
    website: rawProfile.website || null,
    company_name: rawProfile.company_name || null,
    privacy_enabled: !!rawProfile.privacy_enabled,
    created_at: rawProfile.created_at || new Date().toISOString(),
    sections_order: Array.isArray(rawProfile.sections_order) ? rawProfile.sections_order : [],
    latitude: rawProfile.latitude || null,
    longitude: rawProfile.longitude || null,
    job_title: rawProfile.job_title || null
  };
}

/**
 * Convertit une date potentiellement au format Date en string
 */
export function formatDateToString(date: string | Date | null | undefined): string | null {
  if (!date) return null;
  
  if (date instanceof Date) {
    return date.toISOString();
  }
  
  return date;
}

/**
 * Transforme une expérience pour qu'elle soit compatible avec l'API
 */
export function transformToExperience(experience: any): any {
  return {
    ...experience,
    start_date: formatDateToString(experience.start_date),
    end_date: formatDateToString(experience.end_date)
  };
}

/**
 * Transforme une liste d'éducations pour être compatible avec l'API
 */
export function transformEducations(educations: any[]): any[] {
  return educations.map(edu => ({
    ...edu,
    start_date: formatDateToString(edu.start_date),
    end_date: formatDateToString(edu.end_date)
  }));
}

/**
 * Transforme une liste de certifications pour être compatible avec l'API
 */
export function transformCertifications(certifications: any[]): any[] {
  return certifications.map(cert => ({
    ...cert,
    issue_date: formatDateToString(cert.issue_date),
    expiry_date: formatDateToString(cert.expiry_date)
  }));
}
