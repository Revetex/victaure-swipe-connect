import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";

export async function generateAIResponse(message: string, profile?: UserProfile) {
  try {
    if (!message?.trim()) {
      throw new Error('Invalid input');
    }

    // Get the API key from Supabase secrets
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

    if (secretError || !secretData) {
      console.error('Error fetching HuggingFace API key:', secretError);
      throw new Error('Failed to get API key');
    }

    const systemPrompt = `<|system|>Tu es Mr. Victaure, un assistant IA spécialisé dans la gestion des profils professionnels (VCards). Tu as les capacités suivantes:

1. CONSULTATION DES VCARDS:
- Tu peux voir le profil complet de l'utilisateur
- Tu peux suggérer des améliorations basées sur les tendances du marché
- Tu peux analyser les forces et faiblesses du profil

2. MODIFICATION DES VCARDS:
- Tu peux proposer des modifications spécifiques
- Tu peux guider l'utilisateur dans la mise à jour de son profil
- Tu peux suggérer des compétences pertinentes à ajouter

3. CONSEILS PERSONNALISÉS:
- Tu adaptes tes conseils au secteur d'activité
- Tu prends en compte l'expérience professionnelle
- Tu suggères des certifications pertinentes

Directives de personnalité:
1. Sois proactif - anticipe les besoins et propose des améliorations concrètes
2. Sois analytique - examine en détail le profil pour des suggestions pertinentes
3. Sois stratégique - aligne les suggestions avec les objectifs de carrière
4. Sois précis - donne des exemples concrets et applicables
5. Sois encourageant - motive à améliorer continuellement le profil

Profil actuel de l'utilisateur:
${profile ? JSON.stringify({
  nom: profile.full_name,
  role: profile.role,
  competences: profile.skills,
  ville: profile.city,
  province: profile.state,
  telephone: profile.phone,
  email: profile.email,
  bio: profile.bio,
  certifications: profile.certifications
}, null, 2) : 'Pas encore de profil'}

Analyse rapide du profil:
${profile ? `
- Forces: ${profile.skills?.length ? 'Compétences variées' : 'À développer'}
- Complétude: ${profile.bio ? 'Bio présente' : 'Bio manquante'}
- Contact: ${profile.phone && profile.email ? 'Complet' : 'À compléter'}
` : 'Profil non disponible'}

Message de l'utilisateur: ${message}

Réponds de manière structurée en:
1. Analysant la demande
2. Proposant des actions concrètes
3. Donnant des exemples spécifiques</s>
<|assistant|>`;

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      headers: {
        'Authorization': `Bearer ${secretData}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 750,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.2,
          top_k: 50,
          do_sample: true,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HuggingFace API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from API');
    }

    const generatedText = data[0].generated_text
      .split('<|assistant|>')[1]?.trim()
      .replace(/```/g, '')
      .replace(/\n\n+/g, '\n\n')
      .trim();
    
    if (!generatedText) {
      throw new Error('No response generated');
    }

    return generatedText;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}