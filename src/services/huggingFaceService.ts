import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function generateAIResponse(message: string) {
  console.info("Sending request to Hugging Face API...");
  
  try {
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_ACCESS_TOKEN' });
    
    if (secretError || !secretData) {
      console.error("Error fetching API token:", secretError);
      toast.error("Erreur lors de la récupération du token API");
      return null;
    }

    const API_TOKEN = secretData;
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          inputs: `<|im_start|>user
${message}<|im_end|>
<|im_start|>assistant
`,
          parameters: {
            max_new_tokens: 1024,
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
      console.error("Hugging Face API Error:", errorText);
      
      if (response.status === 400 && errorText.includes("Authorization")) {
        toast.error("Le token d'API semble invalide. Veuillez vérifier votre configuration.");
      } else {
        toast.error("Erreur lors de la génération de la réponse");
      }
      return null;
    }

    const result = await response.json();
    if (Array.isArray(result) && result.length > 0) {
      const generatedText = result[0]?.generated_text;
      if (generatedText) {
        return generatedText.trim();
      }
    }

    console.error("Unexpected API response format:", result);
    return null;

  } catch (error) {
    console.error("Error generating AI response:", error);
    toast.error("Erreur lors de la génération de la réponse");
    return null;
  }
}