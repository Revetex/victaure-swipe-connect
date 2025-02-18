import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

interface BioContext {
  skills: string[];
  experiences: {
    position: string;
    company: string;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
  }[];
  education: {
    degree: string;
    field_of_study?: string | null;
    school_name: string;
  }[];
  certifications: {
    title: string;
    issuer: string;
  }[];
}

export async function generateBio(profile: UserProfile): Promise<string> {
  if (!profile) {
    throw new Error("Profil non disponible");
  }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Session error:", sessionError);
    throw new Error("Erreur d'authentification");
  }

  if (!session) {
    throw new Error("Veuillez vous connecter pour générer une bio");
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("User verification error:", userError);
    throw new Error("Erreur de vérification utilisateur");
  }

  const bioContext: BioContext = {
    skills: profile.skills || [],
    experiences: (profile.experiences || []).map((exp) => ({
      position: exp.position,
      company: exp.company,
      description: exp.description,
      start_date: exp.start_date,
      end_date: exp.end_date
    })),
    education: (profile.education || []).map((edu) => ({
      degree: edu.degree,
      field_of_study: edu.field_of_study,
      school_name: edu.school_name
    })),
    certifications: (profile.certifications || []).map((cert) => ({
      title: cert.title,
      issuer: cert.issuer
    }))
  };

  console.log("Generating bio with context:", bioContext);

  const { data, error } = await supabase.functions.invoke('generate-bio', {
    body: {
      ...bioContext,
      options: {
        creativity: 0.9,
        style: "professional",
        maxLength: 500,
        format: "paragraphs",
        language: "fr",
        tone: "confident",
        focus: ["achievements", "expertise", "potential"],
        includeKeywords: true
      }
    }
  });

  if (error) {
    console.error("Error from generate-bio function:", error);
    throw new Error("Erreur lors de la génération de la bio");
  }

  if (!data?.bio) {
    throw new Error("Aucune bio générée");
  }

  return data.bio;
}