
import { UserProfile, Experience } from "@/types/profile";

export function transformToFullProfile(data: any): UserProfile {
  return {
    id: data.id || '',
    email: data.email || '',
    full_name: data.full_name || null,
    avatar_url: data.avatar_url || null,
    role: (data.role as 'professional' | 'business' | 'admin') || 'professional',
    bio: data.bio || null,
    phone: data.phone || null,
    city: data.city || null,
    state: data.state || null,
    country: data.country || 'Canada',
    skills: data.skills || [],
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    online_status: data.online_status || false,
    last_seen: data.last_seen || new Date().toISOString(),
    certifications: data.certifications || [],
    education: data.education || [],
    experiences: data.experiences || [],
    friends: data.friends || [],
    company_name: data.company_name || undefined,
    created_at: data.created_at || new Date().toISOString(),
    privacy_enabled: data.privacy_enabled || false,
    sections_order: data.sections_order || [],
    website: data.website || undefined,
    verified: data.verified || false
  };
}

export function transformToExperience(data: any): Experience {
  return {
    id: data.id || crypto.randomUUID(),
    profile_id: data.profile_id || '',
    position: data.position || '',
    company: data.company || '',
    start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
    end_date: data.end_date ? new Date(data.end_date).toISOString() : undefined,
    description: data.description || '',
    created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString(),
    updated_at: data.updated_at ? new Date(data.updated_at).toISOString() : new Date().toISOString()
  };
}

export function transformSearchResults(results: any[]): UserProfile[] {
  return results.map(result => transformToFullProfile(result));
}
