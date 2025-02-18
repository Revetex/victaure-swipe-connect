
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
    if (!user) throw new Error("No authenticated user");

    // Préparation des données de base du profil
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
      role: tempProfile.role || 'professional',
      avatar_url: tempProfile.avatar_url || null,
      style_id: tempProfile.style_id || 'modern'
    };

    // Mise à jour du profil de base
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData);

    if (profileError) throw profileError;

    // Mise à jour des certifications
    if (tempProfile.certifications?.length > 0) {
      // Suppression des anciennes certifications
      await supabase
        .from('certifications')
        .delete()
        .eq('profile_id', user.id);

      // Insertion des nouvelles certifications
      const { error: certError } = await supabase
        .from('certifications')
        .insert(tempProfile.certifications.map(cert => ({
          profile_id: user.id,
          title: cert.title,
          issuer: cert.issuer,
          description: cert.description || null,
          credential_url: cert.credential_url || null
        })));

      if (certError) throw certError;
    }

    // Mise à jour de l'éducation
    if (tempProfile.education?.length > 0) {
      // Suppression des anciennes formations
      await supabase
        .from('education')
        .delete()
        .eq('profile_id', user.id);

      // Insertion des nouvelles formations
      const { error: eduError } = await supabase
        .from('education')
        .insert(tempProfile.education.map(edu => ({
          profile_id: user.id,
          school_name: edu.school_name,
          degree: edu.degree,
          field_of_study: edu.field_of_study || null,
          start_date: edu.start_date || null,
          end_date: edu.end_date || null
        })));

      if (eduError) throw eduError;
    }

    // Mise à jour des expériences
    if (tempProfile.experiences?.length > 0) {
      // Suppression des anciennes expériences
      await supabase
        .from('experiences')
        .delete()
        .eq('profile_id', user.id);

      // Insertion des nouvelles expériences
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

      if (expError) throw expError;
    }

  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
};
