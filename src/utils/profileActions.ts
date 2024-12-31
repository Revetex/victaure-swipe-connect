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

  // Update main profile
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
      website: tempProfile.website,
      company_name: tempProfile.company_name,
      company_size: tempProfile.company_size,
      industry: tempProfile.industry,
    })
    .eq('id', user.id);

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw profileError;
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