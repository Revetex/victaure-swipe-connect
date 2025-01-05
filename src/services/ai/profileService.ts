import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
}

export function formatSystemPrompt(profile: UserProfile | null, basePrompt: string): string {
  if (!profile) return basePrompt;
  
  return basePrompt
    .replace('{role}', profile.role || 'non spécifié')
    .replace('{skills}', profile.skills?.join(', ') || 'non spécifiées')
    .replace('{city}', profile.city || 'non spécifiée')
    .replace('{state}', profile.state || 'non spécifié')
    .replace('{country}', profile.country || 'non spécifié');
}