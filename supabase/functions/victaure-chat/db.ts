
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { UserProfile, SafeContext } from './types.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      role,
      bio,
      skills,
      city,
      country,
      experiences (
        position,
        company,
        start_date,
        end_date,
        description
      ),
      education (
        school_name,
        degree,
        field_of_study,
        start_date,
        end_date
      ),
      certifications (
        title,
        institution,
        year
      )
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
};

export const saveInteractionToDb = async (
  question: string,
  response: string,
  userId: string | undefined,
  context: { profile: UserProfile | null }
) => {
  try {
    const tags = extractTags(question);
    const safeContext = createSafeContext(context);

    await supabase.from('ai_learning_data').insert({
      question,
      response,
      context: safeContext,
      tags,
      user_id: userId,
      metadata: {
        timestamp: new Date().toISOString(),
        messageLength: question.length,
        responseLength: response.length
      }
    });
  } catch (error) {
    console.error('Error saving interaction:', error);
  }
};

const extractTags = (message: string): string[] => {
  const topics = [
    "emploi", "recrutement", "profil", "cv", "formation", 
    "compétences", "entretien", "carrière", "navigation", 
    "technique", "général", "aide"
  ];
  
  return topics.filter(topic => 
    message.toLowerCase().includes(topic.toLowerCase())
  );
};

const createSafeContext = (context: { profile: UserProfile | null }): SafeContext | null => {
  if (!context.profile) return null;

  return {
    hasProfile: !!context.profile,
    userRole: context.profile.role,
    hasExperience: (context.profile.experiences?.length || 0) > 0,
    hasEducation: (context.profile.education?.length || 0) > 0,
    hasCertifications: (context.profile.certifications?.length || 0) > 0,
    hasSkills: (context.profile.skills?.length || 0) > 0,
    country: context.profile.country
  };
};
