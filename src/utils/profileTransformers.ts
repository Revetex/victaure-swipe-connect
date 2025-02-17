
import { UserProfile, Experience, Education, Certification } from "@/types/profile";

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
    certifications: [],
    education: [],
    experiences: [],
    friends: [],
    company_name: data.company_name || undefined,
    company_size: data.company_size || undefined,
    industry: data.industry || undefined,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    account_locked: data.account_locked || false,
    auto_update_enabled: data.auto_update_enabled || true,
    availability_date: data.availability_date || undefined,
    career_objectives: data.career_objectives || undefined,
    certificates: data.certificates || [],
    chess_elo: data.chess_elo || 1200,
    custom_font: data.custom_font || null,
    custom_background: data.custom_background || null,
    custom_text_color: data.custom_text_color || null,
    sections_order: data.sections_order || [],
    style_id: data.style_id || undefined,
    tools_order: data.tools_order || [],
    push_notifications_enabled: data.push_notifications_enabled || true,
    push_token: data.push_token || undefined,
    location_enabled: data.location_enabled || false,
    search_enabled: data.search_enabled || true,
    privacy_enabled: data.privacy_enabled || false,
    website: data.website || undefined
  };
}

export function transformToExperience(data: any): Experience {
  return {
    id: data.id,
    profile_id: data.profile_id || '',
    position: data.position,
    company: data.company,
    start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
    end_date: data.end_date ? new Date(data.end_date).toISOString() : undefined,
    description: data.description,
    created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString(),
    updated_at: data.updated_at ? new Date(data.updated_at).toISOString() : new Date().toISOString()
  };
}
