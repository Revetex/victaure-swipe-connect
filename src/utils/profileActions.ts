import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/data/mockProfile";

export const generateVCardData = (profile: UserProfile) => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
TITLE:${profile.title}
TEL:${profile.phone}
EMAIL:${profile.email}
NOTE:Skills: ${profile.skills.join(", ")}
END:VCARD`;
  return vcard;
};

export const updateProfile = async (tempProfile: UserProfile) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");

  console.log("Updating profile with data:", tempProfile);

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: tempProfile.name,
      role: 'professional', // On force le rôle 'professional' pour l'instant
      email: tempProfile.email,
      skills: tempProfile.skills,
    })
    .eq('id', user.id);

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  console.log("Profile updated successfully");
};