import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function generateAIResponse(message: string, profile?: any) {
  try {
    // Fetch real-time job data when message mentions jobs
    let jobContext = "";
    if (message.toLowerCase().includes("emploi") || 
        message.toLowerCase().includes("job") || 
        message.toLowerCase().includes("travail") ||
        message.toLowerCase().includes("offre") ||
        message.toLowerCase().includes("poste")) {
      const { data: { jobs }, error } = await supabase.functions.invoke('fetch-jobs');
      
      if (error) {
        console.error('Error fetching jobs:', error);
      }
      
      if (jobs && jobs.length > 0) {
        jobContext = `Voici les dernières offres d'emploi que j'ai trouvées :
${jobs.map((job: any) => `- ${job.title} chez ${job.company} à ${job.location} (via ${job.platform})`).join('\n')}`;
      }
    }

    // Add job context to the conversation if available
    const contextualizedMessage = jobContext ? 
      `${message}\n\nContext des offres d'emploi actuelles:\n${jobContext}` : 
      message;

    console.log("Sending request to Hugging Face API...");
    
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

    console.log("Response status:", response.status);

    if (!response.ok) {
      const clonedResponse = response.clone();
      const errorText = await clonedResponse.text();
      console.error("Hugging Face API Error:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        if (response.status === 400 && errorData.error?.includes("token")) {
          toast.error("Le token Hugging Face semble invalide. Veuillez vérifier votre configuration.");
          throw new Error("Invalid Hugging Face token");
        }
      } catch (e) {
        console.error("Error parsing error response:", e);
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const clonedResponse = response.clone();
    const result = await clonedResponse.json();
    console.log("API Response:", result);

    const generatedText = Array.isArray(result) ? result[0].generated_text : result.generated_text;

    if (!generatedText) {
      throw new Error("Réponse invalide de l'API");
    }

    // Extract the assistant's response (everything after the last [/INST] tag)
    const assistantResponse = generatedText.split("[/INST]").pop()?.trim();

    if (!assistantResponse) {
      throw new Error("Réponse invalide de l'API");
    }

    return assistantResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("token")) {
        throw new Error("Token Hugging Face invalide");
      }
    }
    
    throw error;
  }
}