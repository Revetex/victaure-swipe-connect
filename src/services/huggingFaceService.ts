import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function generateAIResponse(message: string, profile?: any) {
  try {
    // Get the API token from Supabase secrets
    const { data, error: secretError } = await supabase.rpc('get_secret', {
      secret_name: 'HUGGING_FACE_ACCESS_TOKEN'
    });

    if (secretError || !data || data.length === 0) {
      console.error('Error fetching Hugging Face token:', secretError);
      toast.error("Token d'API manquant. Veuillez configurer votre token Hugging Face.");
      throw new Error("Missing Hugging Face token");
    }

    const secret = data[0].secret;

    console.log("Sending request to Hugging Face API...");
    
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secret}`,
      },
      body: JSON.stringify({
        inputs: `<s>[INST] Tu es Mr. Victaure, un assistant IA professionnel et sympathique. Tu dois répondre en français de manière concise et professionnelle.
${profile ? `Contexte sur l'utilisateur :
- Nom : ${profile.full_name}
- Rôle : ${profile.role}
- Entreprise : ${profile.company_name}
- Industrie : ${profile.industry}` : ''}

Message de l'utilisateur : ${message} [/INST]`,
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
      const responseText = await response.text();
      let errorMessage;
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || 'Unknown error';
      } catch {
        errorMessage = responseText;
      }

      console.error("Hugging Face API Error:", errorMessage);
      
      if (response.status === 400 && errorMessage.includes("Authorization")) {
        toast.error("Le token d'API semble invalide. Veuillez vérifier votre configuration.");
        throw new Error("Invalid Hugging Face token");
      }
      
      throw new Error(`Erreur de l'API Hugging Face: ${errorMessage}`);
    }

    const result = await response.json();
    console.log("API Response:", result);

    if (!Array.isArray(result) || result.length === 0 || !result[0].generated_text) {
      throw new Error("Réponse invalide de l'API");
    }

    // Extract the assistant's response (everything after the last [/INST] tag)
    const assistantResponse = result[0].generated_text.split("[/INST]").pop()?.trim();

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