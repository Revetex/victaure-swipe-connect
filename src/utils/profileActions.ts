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

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: tempProfile.name,
      role: 'professional',
      skills: tempProfile.skills,
    })
    .eq('id', user.id);

  if (error) throw error;
};