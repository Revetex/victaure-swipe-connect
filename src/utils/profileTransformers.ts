
import type { 
  Experience,
  Education,
  UserRole,
  Certification,
  UserProfile,
  User,
  UserConnection,
  SocialLinks
} from '@/types/profile';

// Transforme les données brutes d'un profil en objet Profile
export const transformToProfile = (data: any): UserProfile => {
  if (!data) return {} as UserProfile;
  
  return {
    id: data.id || '',
    full_name: data.full_name || '',
    avatar_url: data.avatar_url || '',
    email: data.email || '',
    role: data.role || 'user' as UserRole,
    bio: data.bio || '',
    phone: data.phone || '',
    city: data.city || '',
    state: data.state || '',
    country: data.country || '',
    skills: data.skills || [],
    online_status: typeof data.online_status === 'string' 
      ? data.online_status === 'online' || data.online_status === 'true'
      : !!data.online_status,
    last_seen: data.last_seen || '',
    cover_image: data.cover_image || '',
    job_title: data.job_title || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    social_links: data.social_links || {},
    friends: []
  };
};

// Transforme les données brutes d'une expérience en objet Experience
export const transformToExperience = (data: any): Experience => {
  if (!data) return {} as Experience;
  
  return {
    id: data.id || '',
    company: data.company || '',
    position: data.position || '',
    start_date: data.start_date || '',
    end_date: data.end_date || null,
    description: data.description || '',
    skills: data.skills || [],
    logo_url: data.logo_url || ''
  };
};

// Transforme les données brutes d'une formation en objet Education
export const transformToEducation = (data: any): Education => {
  if (!data) return {} as Education;
  
  return {
    id: data.id || '',
    school_name: data.school_name || data.institution || '',
    degree: data.degree || '',
    field_of_study: data.field_of_study || '',
    start_date: data.start_date || '',
    end_date: data.end_date || null,
    description: data.description || '',
    logo_url: data.logo_url || ''
  };
};

// Transforme les données d'un utilisateur basique en objet User plus complet
export const transformToFullProfile = (data: any): User => {
  if (!data) return {} as User;
  
  // Créer un objet de base avec les champs obligatoires
  const user: User = {
    id: data.id || '',
    full_name: data.full_name || '',
    avatar_url: data.avatar_url || '',
    email: data.email || '',
    role: data.role || 'user' as UserRole,
    bio: data.bio || '',
    phone: data.phone || '',
    city: data.city || '',
    state: data.state || '',
    country: data.country || '',
    skills: data.skills || [],
    online_status: typeof data.online_status === 'string' 
      ? data.online_status === 'online' || data.online_status === 'true'
      : !!data.online_status,
    last_seen: data.last_seen || '',
    job_title: data.job_title || '',
    created_at: data.created_at || '',
    cover_image: data.cover_image || '',
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    friends: data.friends || [],
    certifications: data.certifications || [],
    education: data.education || [],
    experiences: data.experiences || []
  };
  
  return user;
};

// Transforme les données d'une demande de connexion
export const transformConnection = (data: any): UserConnection => {
  if (!data) return {} as UserConnection;
  
  return {
    id: data.id || '',
    user_id: data.user_id || '',
    connected_user_id: data.connected_user_id || '',
    status: data.status || 'pending',
    connection_type: data.connection_type || '',
    visibility: data.visibility || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
    user: data.user ? transformToProfile(data.user) : undefined,
    connected_user: data.connected_user ? transformToProfile(data.connected_user) : undefined
  };
};

// Transforme les données brutes d'une certification en objet Certification
export const transformToCertification = (data: any): Certification => {
  if (!data) return {} as Certification;
  
  return {
    id: data.id || '',
    title: data.title || data.name || '',
    issuer: data.issuer || '',
    issue_date: data.issue_date || '',
    expiry_date: data.expiry_date || null,
    credential_url: data.credential_url || '',
    credential_id: data.credential_id || '',
    logo_url: data.logo_url || ''
  };
};
