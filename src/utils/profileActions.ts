
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { toast } from "sonner";
import { formatDateToString } from "./profileTransformers";

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

    // Préparer les données de base du profil
    const baseProfileData = {
      id: user.id,
      full_name: tempProfile.full_name,
      email: tempProfile.email,
      phone: tempProfile.phone || null,
      city: tempProfile.city || null,
      state: tempProfile.state || null,
      country: tempProfile.country || 'Canada',
      skills: Array.isArray(tempProfile.skills) ? tempProfile.skills : [],
      bio: tempProfile.bio || null,
      role: tempProfile.role || 'professional',
      updated_at: new Date().toISOString()
    };

    // Mettre à jour le profil de base
    const { error: profileError } = await supabase
      .from('profiles')
      .update(baseProfileData)
      .eq('id', user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      throw profileError;
    }

    // Mettre à jour les certifications si elles existent
    if (tempProfile.certifications?.length > 0) {
      await supabase
        .from('certifications')
        .delete()
        .eq('profile_id', user.id);

      const certifications = tempProfile.certifications.map(cert => ({
        profile_id: user.id,
        title: cert.title,
        issuer: cert.issuer,
        issue_date: formatDateToString(cert.issue_date),
        expiry_date: formatDateToString(cert.expiry_date),
        credential_url: cert.credential_url || null,
        credential_id: cert.credential_id || null,
        description: cert.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: certError } = await supabase
        .from('certifications')
        .insert(certifications);

      if (certError) {
        console.error("Error inserting certifications:", certError);
        throw certError;
      }
    }

    // Mettre à jour l'éducation si elle existe
    if (tempProfile.education?.length > 0) {
      await supabase
        .from('education')
        .delete()
        .eq('profile_id', user.id);

      const education = tempProfile.education.map(edu => ({
        profile_id: user.id,
        school_name: edu.school_name,
        degree: edu.degree,
        field_of_study: edu.field_of_study || null,
        start_date: formatDateToString(edu.start_date),
        end_date: formatDateToString(edu.end_date),
        description: edu.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: eduError } = await supabase
        .from('education')
        .insert(education);

      if (eduError) {
        console.error("Error inserting education:", eduError);
        throw eduError;
      }
    }

    // Mettre à jour les expériences si elles existent
    if (tempProfile.experiences?.length > 0) {
      await supabase
        .from('experiences')
        .delete()
        .eq('profile_id', user.id);

      const experiences = tempProfile.experiences.map(exp => ({
        profile_id: user.id,
        company: exp.company,
        position: exp.position,
        start_date: formatDateToString(exp.start_date),
        end_date: formatDateToString(exp.end_date),
        description: exp.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: expError } = await supabase
        .from('experiences')
        .insert(experiences);

      if (expError) {
        console.error("Error inserting experiences:", expError);
        throw expError;
      }
    }

    toast.success("Profil mis à jour avec succès");
    
  } catch (error: any) {
    console.error('Error in updateProfile:', error);
    toast.error(error.message || "Erreur lors de la mise à jour du profil");
    throw error;
  }
};
