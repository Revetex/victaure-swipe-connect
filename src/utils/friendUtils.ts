
import { Friend, UserProfile } from "@/types/profile";
import { Receiver } from "@/types/messages";

/**
 * Converts a Friend to a Receiver object for use in messaging
 */
export function friendToReceiver(friend: Friend): Receiver {
  return {
    id: friend.id,
    full_name: friend.full_name,
    avatar_url: friend.avatar_url,
    online_status: friend.online_status,
    last_seen: friend.last_seen,
    email: friend.email,
    role: friend.role
  };
}

/**
 * Converts a UserProfile to a Friend object
 */
export function profileToFriend(profile: UserProfile): Friend {
  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    role: profile.role,
    bio: profile.bio,
    phone: profile.phone,
    city: profile.city,
    state: profile.state,
    country: profile.country,
    skills: profile.skills,
    online_status: profile.online_status,
    last_seen: profile.last_seen,
    created_at: profile.created_at,
    job_title: profile.job_title,
    friends: [] // Ajouter la propriété friends obligatoire
  };
}

/**
 * Converts a UserProfile to a Receiver object for use in messaging
 */
export function profileToReceiver(profile: UserProfile): Receiver {
  return {
    id: profile.id,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    online_status: profile.online_status,
    last_seen: profile.last_seen,
    email: profile.email,
    latitude: profile.latitude,
    longitude: profile.longitude,
    role: profile.role,
    bio: profile.bio
  };
}

/**
 * Converts a Receiver to a Friend object
 */
export function receiverToFriend(receiver: Receiver): Friend {
  return {
    id: receiver.id,
    email: receiver.email || null,
    full_name: receiver.full_name,
    avatar_url: receiver.avatar_url,
    role: (receiver.role as any) || 'professional',
    online_status: receiver.online_status,
    last_seen: receiver.last_seen,
    bio: receiver.bio || null,
    created_at: new Date().toISOString(),
    friends: [] // Ajouter la propriété friends obligatoire
  };
}
