
import { supabase } from "@/integrations/supabase/client";

export const aiAgentService = {
  async searchJobs() {
    console.log("Searching for jobs...");
    const { data, error } = await supabase.functions.invoke('smart-job-scraper', {
      body: { action: 'search_jobs' }
    });

    if (error) {
      console.error("Error searching jobs:", error);
      throw error;
    }
    console.log("Jobs found:", data);
    return data;
  },

  async matchJobs(userId: string) {
    console.log("Matching jobs for user:", userId);
    const { data, error } = await supabase.functions.invoke('ai-agents', {
      body: { 
        action: 'match_jobs',
        userId
      }
    });

    if (error) {
      console.error("Error matching jobs:", error);
      throw error;
    }
    console.log("Matched jobs:", data);
    return data;
  },

  async handleMessage(message: string) {
    console.log("Handling message:", message);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    // Get real-time job data before processing the message
    const { data: recentJobs } = await supabase
      .from('scraped_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data, error } = await supabase.functions.invoke('ai-agents', {
      body: {
        action: 'handle_message',
        userId: user.id,
        message,
        context: {
          recentJobs,
          userProfile,
          lastSearch: new Date().toISOString()
        }
      }
    });

    if (error) {
      console.error("Error handling message:", error);
      throw error;
    }
    
    console.log("AI response:", data);
    return data;
  }
};
