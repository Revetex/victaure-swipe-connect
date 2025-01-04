import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function loadMessages() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("ai_chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in loadMessages:", error);
    return [];
  }
}

export async function saveMessage(message: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("ai_chat_messages")
    .insert([{
      id: message.id,
      content: message.content,
      sender: message.sender,
      user_id: user.id,
      created_at: message.created_at
    }]);

  if (error) throw error;
}

export async function generateAIResponse(message: string, profile?: any) {
  try {
    console.log("Starting AI response generation...");
    
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });
    
    if (secretError || !secretData) {
      console.error("Error fetching API token:", secretError);
      throw new Error("Impossible de récupérer le token API. Veuillez configurer votre clé API Hugging Face dans les paramètres.");
    }

    if (!secretData[0]?.secret?.trim()) {
      throw new Error("La clé API Hugging Face n'est pas configurée. Veuillez l'ajouter dans les paramètres.");
    }

    const contextPrompt = profile ? 
      `Contexte: Profil utilisateur - Nom: ${profile.full_name}, Rôle: ${profile.role}\n` : '';
    
    const systemPrompt = `Tu es Mr. Victaure, un assistant virtuel professionnel et amical spécialisé dans l'aide à la recherche d'emploi et le développement de carrière. Tu dois:
    - Répondre en français de manière claire et naturelle
    - Être empathique et encourageant
    - Donner des conseils pratiques et actionnables
    - Adapter tes réponses au profil de l'utilisateur quand disponible
    - Rester professionnel tout en étant chaleureux
    ${contextPrompt}`;

    console.log("Making request to Hugging Face API...");
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${secretData[0].secret}`,
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
      
      if (response.status === 503) {
        throw new Error("Le modèle est en cours de chargement, veuillez patienter quelques secondes et réessayer.");
      } else if (response.status === 400) {
        if (errorText.includes("token seems invalid")) {
          throw new Error("La clé API Hugging Face semble invalide. Veuillez vérifier et mettre à jour votre clé API dans les paramètres.");
        }
        throw new Error("Erreur d'authentification avec l'API Hugging Face. Veuillez vérifier votre clé API.");
      } else {
        throw new Error(`Erreur API Hugging Face: ${errorText || 'Erreur inconnue'}`);
      }
    }

    const result = await response.json();
    console.log("API Response:", result);

    if (!result || !result[0] || !result[0].generated_text) {
      throw new Error("Format de réponse invalide de l'API");
    }

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
      throw error;
    }
    throw new Error("Une erreur inattendue est survenue lors de la génération de la réponse");
  }
}