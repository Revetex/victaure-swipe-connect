import type { UserProfile } from "@/types/profile";
import { generateAIResponse } from "../huggingFaceService";

export async function getFallbackResponse(profile?: UserProfile): Promise<string> {
  try {
    // Generate a dynamic response using the AI model
    const fallbackPrompt = profile 
      ? `Je suis un assistant IA et je remarque une erreur. Pour vous aider au mieux ${profile.full_name}, pouvez-vous me donner plus de détails sur votre demande ?`
      : "Je suis un assistant IA et je remarque une erreur. Pour vous aider au mieux, pouvez-vous me donner plus de détails sur votre demande ?";
    
    const response = await generateAIResponse(fallbackPrompt, profile);
    return response;
  } catch (error) {
    console.error('Error generating fallback response:', error);
    // If AI generation fails, return a simple message
    return "Désolé, je rencontre des difficultés techniques. Pouvez-vous reformuler votre demande ?";
  }
}