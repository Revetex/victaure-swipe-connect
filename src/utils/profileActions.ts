import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/data/mockProfile";

export const generateVCardData = (profile: UserProfile) => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
TITLE:${profile.title}
TEL:${profile.phone}
EMAIL:${profile.email}
ADR;TYPE=WORK:;;${profile.city};${profile.state};${profile.country}
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
      role: 'professional',
      email: tempProfile.email,
      phone: tempProfile.phone,
      city: tempProfile.city,
      state: tempProfile.state,
      country: tempProfile.country,
      skills: tempProfile.skills,
    })
    .eq('id', user.id);

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  console.log("Profile updated successfully");
};