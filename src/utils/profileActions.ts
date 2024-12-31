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
NOTE:${profile.bio || ''}
URL:${profile.website || ''}
END:VCARD`;
  return vcard;
};

export const updateProfile = async (tempProfile: UserProfile) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");

  console.log("Updating profile with data:", tempProfile);

  // First check if profile exists
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error("Error checking profile:", checkError);
    throw checkError;
  }

  // Prepare profile data
  const profileData = {
    id: user.id,
    full_name: tempProfile.full_name,
    email: tempProfile.email,
    phone: tempProfile.phone || null,
    city: tempProfile.city || null,
    state: tempProfile.state || null,
    country: tempProfile.country || 'Canada',
    skills: tempProfile.skills || [],
    bio: tempProfile.bio || null,
    latitude: tempProfile.latitude || null,
    longitude: tempProfile.longitude || null,
    website: tempProfile.website || null,
    company_name: tempProfile.company_name || null,
    company_size: tempProfile.company_size || null,
    industry: tempProfile.industry || null,
    role: existingProfile?.role || 'professional' // Always ensure role has a value
  };

  console.log("Profile data to be saved:", profileData);

  // Update or insert profile
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(profileData);

  if (upsertError) {
    console.error("Error upserting profile:", upsertError);
    throw upsertError;
  }

  // Update certifications
  if (tempProfile.certifications) {
    // Delete existing certifications
    const { error: deleteError } = await supabase
      .from('certifications')
      .delete()
      .eq('profile_id', user.id);

    if (deleteError) {
      console.error("Error deleting certifications:", deleteError);
      throw deleteError;
    }

    // Insert new certifications
    if (tempProfile.certifications.length > 0) {
      const { error: certError } = await supabase
        .from('certifications')
        .insert(tempProfile.certifications.map(cert => ({
          ...cert,
          profile_id: user.id
        })));

      if (certError) {
        console.error("Error inserting certifications:", certError);
        throw certError;
      }
    }
  }

  // Update education
  if (tempProfile.education) {
    // Delete existing education
    const { error: deleteError } = await supabase
      .from('education')
      .delete()
      .eq('profile_id', user.id);

    if (deleteError) {
      console.error("Error deleting education:", deleteError);
      throw deleteError;
    }

    // Insert new education
    if (tempProfile.education.length > 0) {
      const { error: eduError } = await supabase
        .from('education')
        .insert(tempProfile.education.map(edu => ({
          ...edu,
          profile_id: user.id
        })));

      if (eduError) {
        console.error("Error inserting education:", eduError);
        throw eduError;
      }
    }
  }

  // Update experiences
  if (tempProfile.experiences) {
    // Delete existing experiences
    const { error: deleteError } = await supabase
      .from('experiences')
      .delete()
      .eq('profile_id', user.id);

    if (deleteError) {
      console.error("Error deleting experiences:", deleteError);
      throw deleteError;
    }

    // Insert new experiences
    if (tempProfile.experiences.length > 0) {
      const { error: expError } = await supabase
        .from('experiences')
        .insert(tempProfile.experiences.map(exp => ({
          ...exp,
          profile_id: user.id
        })));

      if (expError) {
        console.error("Error inserting experiences:", expError);
        throw expError;
      }
    }
  }

  console.log("Profile updated successfully");
};
