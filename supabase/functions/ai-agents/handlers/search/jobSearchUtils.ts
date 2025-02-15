
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface SearchContext {
  profile: any;
  previousSearches?: string[];
  jobPreferences?: {
    salary?: { min?: number; max?: number };
    location?: string;
    remote?: boolean;
    industries?: string[];
  };
}

export async function getPreviousSearches(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from('ai_learning_data')
    .select('question')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);
  
  return data?.map(d => d.question) || [];
}

export async function getJobPreferences(supabase: SupabaseClient, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return {
    location: profile?.city,
    industries: profile?.industry ? [profile.industry] : undefined
  };
}

export async function saveSearchHistory(
  supabase: SupabaseClient, 
  userId: string, 
  searchData: any
) {
  await supabase
    .from('ai_learning_data')
    .insert({
      user_id: userId,
      question: searchData.query,
      context: searchData
    });
}
