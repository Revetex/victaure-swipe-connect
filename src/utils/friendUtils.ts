
import { Friend, Profile } from "@/types/profile";
import { Receiver } from "@/types/messages";

/**
 * Convertit un profil en un objet ami
 */
export function profileToFriend(profile: Profile | null): Friend | null {
  if (!profile) return null;
  
  return {
    id: profile.id,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    online_status: profile.online_status,
    last_seen: profile.last_seen,
    role: profile.role,
    bio: profile.bio,
    phone: profile.phone,
    city: profile.city,
    state: profile.state,
    country: profile.country,
    job_title: profile.job_title,
    skills: profile.skills,
    created_at: profile.created_at,
    email: profile.email
  };
}

/**
 * Convertit un profil en un objet receiver pour la messagerie
 */
export function profileToReceiver(profile: Profile | null): Receiver | null {
  if (!profile) return null;
  
  return {
    id: profile.id,
    full_name: profile.full_name || "Utilisateur",
    avatar_url: profile.avatar_url,
    email: profile.email,
    role: profile.role as any, // Cast pour compatibilité des types entre UserRole dans profile et messages
    bio: profile.bio,
    phone: profile.phone,
    city: profile.city,
    state: profile.state,
    country: profile.country,
    skills: profile.skills,
    online_status: profile.online_status,
    last_seen: profile.last_seen,
    latitude: profile.latitude || null,
    longitude: profile.longitude || null,
    certifications: profile.certifications,
    education: profile.education,
    experiences: profile.experiences
  };
}

/**
 * Convertit un ami en un objet receiver pour la messagerie
 */
export function friendToReceiver(friend: Friend | null): Receiver | null {
  if (!friend) return null;
  
  return {
    id: friend.id,
    full_name: friend.full_name || "Utilisateur",
    avatar_url: friend.avatar_url || null,
    email: friend.email,
    role: friend.role as any,
    bio: friend.bio,
    phone: friend.phone,
    city: friend.city,
    state: friend.state,
    country: friend.country,
    skills: friend.skills || [],
    online_status: friend.online_status,
    last_seen: friend.last_seen
  };
}
