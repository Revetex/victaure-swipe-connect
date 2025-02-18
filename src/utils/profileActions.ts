
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { toast } from "sonner";

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
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour sauvegarder votre profil");
      throw new Error("No authenticated user");
    }

    console.log("Updating profile with data:", tempProfile);

    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking profile:", checkError);
      throw checkError;
    }

    // Prepare profile data, ensuring role is preserved or set
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
      role: tempProfile.role || existingProfile?.role || 'professional',
      avatar_url: tempProfile.avatar_url || existingProfile?.avatar_url,
      style_id: tempProfile.style_id || existingProfile?.style_id,
      updated_at: new Date().toISOString(),
      online_status: false,
      last_seen: new Date().toISOString(),
      account_locked: false,
      auto_update_enabled: true,
      location_enabled: false,
      search_enabled: true,
      privacy_enabled: false,
      push_notifications_enabled: true
    };

    console.log("Profile data to be saved:", profileData);

    // Update profile
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'id'
      });

    if (upsertError) {
      console.error("Error upserting profile:", upsertError);
      throw upsertError;
    }

    // Update certifications if they exist
    if (tempProfile.certifications && tempProfile.certifications.length > 0) {
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
      const { error: certError } = await supabase
        .from('certifications')
        .insert(tempProfile.certifications.map(cert => ({
          profile_id: user.id,
          title: cert.title,
          institution: cert.institution,
          year: cert.year,
          credential_url: cert.credential_url || null,
          description: cert.description || null,
          issuer: cert.institution
        })));

      if (certError) {
        console.error("Error inserting certifications:", certError);
        throw certError;
      }
    }

    // Update education records if they exist
    if (tempProfile.education && tempProfile.education.length > 0) {
      // Delete existing education records
      const { error: deleteError } = await supabase
        .from('education')
        .delete()
        .eq('profile_id', user.id);

      if (deleteError) {
        console.error("Error deleting education:", deleteError);
        throw deleteError;
      }

      // Insert new education records
      const { error: eduError } = await supabase
        .from('education')
        .insert(tempProfile.education.map(edu => ({
          profile_id: user.id,
          school_name: edu.school_name,
          degree: edu.degree,
          field_of_study: edu.field_of_study || null,
          start_date: edu.start_date || null,
          end_date: edu.end_date || null,
          description: edu.description || null
        })));

      if (eduError) {
        console.error("Error inserting education:", eduError);
        throw eduError;
      }
    }

    // Update experiences if they exist
    if (tempProfile.experiences && tempProfile.experiences.length > 0) {
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
      const { error: expError } = await supabase
        .from('experiences')
        .insert(tempProfile.experiences.map(exp => ({
          profile_id: user.id,
          company: exp.company,
          position: exp.position,
          start_date: exp.start_date || null,
          end_date: exp.end_date || null,
          description: exp.description || null
        })));

      if (expError) {
        console.error("Error inserting experiences:", expError);
        throw expError;
      }
    }

    console.log("Profile updated successfully");
    toast.success("Profil mis à jour avec succès");
    
  } catch (error: any) {
    console.error('Error in updateProfile:', error);
    if (error.code === '23505') {
      toast.error("Un profil avec cet email existe déjà");
    } else if (error.code === '23503') {
      toast.error("Erreur de référence. Veuillez vérifier vos données");
    } else {
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    }
    throw error;
  }
};
