
import { Receiver } from "@/types/messages";
import { User, UserProfile } from "@/types/profile";

/**
 * Creates a Receiver object from a User or UserProfile
 */
export function createReceiverFromUser(user: User | UserProfile | null): Receiver | null {
  if (!user) return null;
  
  return {
    id: user.id,
    full_name: user.full_name,
    avatar_url: (user as UserProfile).avatar_url || (user as User).avatar_url || null,
    email: user.email || null,
    online_status: (user as UserProfile).online_status || false,
    last_seen: (user as UserProfile).last_seen || null,
    // Don't include role as it's not in Receiver
  };
}

/**
 * Gets the name to display for a receiver
 */
export function getReceiverDisplayName(receiver: Receiver | null): string {
  if (!receiver) return "Unknown";
  if (receiver.full_name) return receiver.full_name;
  return receiver.email?.split('@')[0] || "User";
}

/**
 * Creates an empty Receiver object with default values
 */
export function createEmptyReceiver(id: string): Receiver {
  return {
    id,
    full_name: null,
    avatar_url: null,
    email: null,
    online_status: false,
    last_seen: null,
    // Don't include non-Receiver properties
  };
}

/**
 * Enhances a Receiver with extra properties for display
 */
export function enhanceReceiver(receiver: Receiver, extras: Partial<Receiver> = {}): Receiver {
  return {
    ...receiver,
    ...extras,
    // Don't include non-Receiver properties
  };
}

/**
 * Creates a receiver from a profile object
 */
export function receiverFromProfile(profile: any): Receiver {
  if (!profile) return createEmptyReceiver('unknown');
  
  return {
    id: profile.id || 'unknown',
    full_name: profile.full_name || null,
    avatar_url: profile.avatar_url || null,
    email: profile.email || null,
    online_status: profile.online_status || false,
    last_seen: profile.last_seen || null,
    // Don't access or use properties that don't exist on Receiver
  };
}

/**
 * Gets the bio text from a profile or receiver, safely
 */
export function getSafeBioText(profile: UserProfile | Receiver | null): string | null {
  if (!profile) return null;
  
  // Check if the property exists before accessing
  if ('bio' in profile && typeof profile.bio === 'string') {
    return profile.bio;
  }
  
  return null;
}
