import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function saveMessage(message: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  return await supabase.from("ai_chat_messages").insert([{ ...message, user_id: user.id }]);
}

export async function loadMessages() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("ai_chat_messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return data || [];
}

export async function generateAIResponse(message: string, profile?: any) {
  try {
    console.log("Generating AI response...");
    
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });
    
    if (secretError || !secretData) {
      console.error("Error fetching API token:", secretError);
      throw new Error("Impossible de récupérer le token API");
    }

    const API_TOKEN = secretData;

    // Include profile context if provided
    const contextPrompt = profile ? 
      `Contexte: Profil utilisateur - Nom: ${profile.full_name}, Rôle: ${profile.role}\n` : '';
    
    const systemPrompt = `Tu es Mr. Victaure, un assistant virtuel professionnel et amical spécialisé dans l'aide à la recherche d'emploi et le développement de carrière. Tu dois:
    - Répondre en français de manière claire et naturelle
    - Être empathique et encourageant
    - Donner des conseils pratiques et actionnables
    - Adapter tes réponses au profil de l'utilisateur quand disponible
    - Rester professionnel tout en étant chaleureux
    ${contextPrompt}`;
    
    console.log("Sending request to Hugging Face API...");
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<|im_start|>system
${systemPrompt}
<|im_end|>
<|im_start|>user
${message}
<|im_end|>
<|im_start|>assistant`,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error Response:", errorText);
      console.error("Response status:", response.status);
      console.error("Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (response.status === 503) {
        throw new Error("Le modèle est en cours de chargement, veuillez patienter quelques secondes et réessayer.");
      } else {
        throw new Error("Une erreur est survenue lors de la communication avec l'API");
      }
    }

    const result = await response.json();
    console.log("API Response:", result);

    if (!result || !result[0] || !result[0].generated_text) {
      throw new Error("Format de réponse invalide de l'API");
    }

    // Clean up the response by removing any remaining tags and trimming whitespace
    const cleanedResponse = result[0].generated_text
      .replace(/<\|im_end\|>/g, '')
      .replace(/<\|im_start\|>assistant/g, '')
      .trim();

    if (!cleanedResponse) {
      throw new Error("La réponse générée est vide");
    }

    return cleanedResponse;

  } catch (error) {
    console.error("Error generating AI response:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Une erreur est survenue lors de la génération de la réponse");
    }
    throw new Error("Une erreur inattendue est survenue");
  }
}