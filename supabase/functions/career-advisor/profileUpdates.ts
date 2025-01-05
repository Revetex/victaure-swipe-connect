import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const updateProfile = async (supabase: any, userId: string, updates: any) => {
  console.log('Updating profile with:', updates);
  
  const { error: updateError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (updateError) {
    throw new Error(`Error updating profile: ${updateError.message}`);
  }
  
  return { success: true };
};

export const addExperience = async (supabase: any, userId: string, experience: any) => {
  console.log('Adding experience:', experience);
  
  const { error } = await supabase
    .from('experiences')
    .insert({
      profile_id: userId,
      ...experience
    });

  if (error) {
    throw new Error(`Error adding experience: ${error.message}`);
  }
  
  return { success: true };
};

export const addSkills = async (supabase: any, userId: string, skills: string[]) => {
  console.log('Adding skills:', skills);
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('skills')
    .eq('id', userId)
    .single();

  const currentSkills = profile?.skills || [];
  const updatedSkills = [...new Set([...currentSkills, ...skills])];

  const { error } = await supabase
    .from('profiles')
    .update({ skills: updatedSkills })
    .eq('id', userId);

  if (error) {
    throw new Error(`Error adding skills: ${error.message}`);
  }
  
  return { success: true };
};