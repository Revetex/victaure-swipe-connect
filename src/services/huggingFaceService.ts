import { supabase } from "@/integrations/supabase/client";

export async function generateAIResponse(message: string, profile?: any) {
  try {
    // Fetch real-time job data when message mentions jobs
    let jobContext = "";
    if (message.toLowerCase().includes("emploi") || 
        message.toLowerCase().includes("job") || 
        message.toLowerCase().includes("travail")) {
      const { data: { jobs } } = await supabase.functions.invoke('fetch-jobs');
      if (jobs && jobs.length > 0) {
        jobContext = `Voici les dernières offres d'emploi que j'ai trouvées :
${jobs.map((job: any) => `- ${job.title} chez ${job.company} à ${job.location} (via ${job.platform})`).join('\n')}`;
      }
    }

    // Add job context to the conversation if available
    const contextualizedMessage = jobContext ? 
      `${message}\n\nContext des offres d'emploi actuelles:\n${jobContext}` : 
      message;

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_HUGGING_FACE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: `<s>[INST] Tu es Mr. Victaure, un assistant IA professionnel et sympathique. Tu dois répondre en français de manière concise et professionnelle.
${profile ? `Contexte sur l'utilisateur :
- Nom : ${profile.full_name}
- Rôle : ${profile.role}
- Entreprise : ${profile.company_name}
- Industrie : ${profile.industry}` : ''}

Message de l'utilisateur : ${contextualizedMessage} [/INST]`,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.15,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const generatedText = Array.isArray(result) ? result[0].generated_text : result.generated_text;

    // Extract the assistant's response (everything after the last [/INST] tag)
    const assistantResponse = generatedText.split("[/INST]").pop().trim();

    return assistantResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}