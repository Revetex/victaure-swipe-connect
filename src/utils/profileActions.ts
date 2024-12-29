import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";

export const generateVCardData = (profile: UserProfile) => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.full_name || ''}
TITLE:${profile.role || ''}
TEL:${profile.phone || ''}
EMAIL:${profile.email}
ADR;TYPE=WORK:;;${profile.city || ''};${profile.state || ''};${profile.country}
NOTE:Skills: ${profile.skills?.join(", ") || ''}
END:VCARD`;
  return vcard;
};

export const updateProfile = async (tempProfile: UserProfile) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");

  console.log("Updating profile with data:", tempProfile);

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: tempProfile.full_name,
      role: tempProfile.role,
      email: tempProfile.email,
      phone: tempProfile.phone,
      city: tempProfile.city,
      state: tempProfile.state,
      country: tempProfile.country,
      skills: tempProfile.skills,
      bio: tempProfile.bio,
      latitude: tempProfile.latitude,
      longitude: tempProfile.longitude,
    })
    .eq('id', user.id);

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw profileError;
  }

  // Create a notification for the profile update
  const { error: notificationError } = await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      title: 'Profil mis à jour',
      message: 'Votre profil a été mis à jour avec succès.',
    });

  if (notificationError) {
    console.error("Error creating notification:", notificationError);
    // We don't throw here as the profile update was successful
  }

  console.log("Profile updated successfully");
};