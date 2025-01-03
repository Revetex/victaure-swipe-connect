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
    console.log("Fetching API token...");

    const { data: secretData, error: secretError } = await supabase.functions.invoke('get-secret', {
      body: { secret_name: 'HUGGING_FACE_ACCESS_TOKEN' }
    });

    if (secretError) {
      console.error("Error fetching API token:", secretError);
      throw new Error("Failed to fetch API token");
    }

    const API_TOKEN = secretData;
    console.log("API token retrieved successfully");

    const contextPrompt = profile ? 
      `Contexte: Profil utilisateur - Nom: ${profile.full_name}, Rôle: ${profile.role}\n` : '';
    
    const systemPrompt = `Tu es un assistant virtuel professionnel et amical. Tu dois répondre en français de manière concise et claire. ${contextPrompt}`;
    
    console.log("Sending request to Hugging Face API...");
    console.log("Context prompt:", contextPrompt);
    
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
      throw new Error(`API Error: ${errorText}`);
    }

    const result = await response.json();
    console.log("API Response:", result);

    if (!result || !result[0] || !result[0].generated_text) {
      throw new Error("Invalid response format from API");
    }

    // Clean up the response by removing any remaining tags and trimming whitespace
    const cleanedResponse = result[0].generated_text
      .replace(/<\|im_end\|>/g, '')
      .replace(/<\|im_start\|>assistant/g, '')
      .trim();

    return cleanedResponse;

  } catch (error) {
    console.error("Error generating AI response:", error);
    toast.error("Une erreur est survenue lors de la génération de la réponse");
    throw error;
  }
}