import { supabase } from "@/integrations/supabase/client";

export const aiAgentService = {
  async searchJobs() {
    const { data, error } = await supabase.functions.invoke('ai-agents', {
      body: { action: 'search_jobs' }
    });

    if (error) throw error;
    return data;
  },

  async matchJobs() {
    const { data, error } = await supabase.functions.invoke('ai-agents', {
      body: { action: 'match_jobs' }
    });

    if (error) throw error;
    return data;
  },

  async handleMessage(message: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase.functions.invoke('ai-agents', {
      body: {
        action: 'handle_message',
        userId: user.id,
        message
      }
    });

    if (error) throw error;
    return data;
  }
};