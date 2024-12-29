import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to get user profile
async function getUserProfile(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return profile;
}

// Helper function to update user profile
async function updateUserProfile(supabase: any, userId: string, updates: any) {
  if (Object.keys(updates).length === 0) return null;
  
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return error;
}

// Helper function to generate response based on context
function generateContextualResponse(message: string, profile: any) {
  // Extract potential profile updates from message
  const profileUpdates: any = {};
  
  if (message.toLowerCase().includes('compétence') || message.toLowerCase().includes('skill')) {
    const skills = message.split(/[,.]/).map(s => s.trim()).filter(s => s.length > 0);
    if (skills.length > 0) {
      profileUpdates.skills = skills;
      return {
        content: "J'ai bien noté vos compétences. Souhaitez-vous mettre à jour d'autres informations de votre profil ?",
        action: 'update_skills',
        updates: profileUpdates
      };
    }
  }

  if (message.toLowerCase().includes('ville') || message.toLowerCase().includes('habite')) {
    const cityMatch = message.match(/(?:à|a|dans|de)\s+([A-Za-zÀ-ÿ\s-]+)(?:\s|$)/i);
    if (cityMatch) {
      profileUpdates.city = cityMatch[1].trim();
      return {
        content: `J'ai mis à jour votre ville à ${profileUpdates.city}. Que puis-je faire d'autre pour vous ?`,
        action: 'update_city',
        updates: profileUpdates
      };
    }
  }

  // Analyze message intent
  const isGreeting = /^(bonjour|salut|allo|hey|hi|hello)/i.test(message);
  const isThanks = /merci|thanks|thank you/i.test(message);
  const isFarewell = /au revoir|bye|ciao|à \+|a \+/i.test(message);
  
  if (isGreeting) {
    const timeOfDay = new Date().getHours();
    const greeting = timeOfDay < 12 ? 'Bonjour' : timeOfDay < 18 ? 'Bon après-midi' : 'Bonsoir';
    return {
      content: `${greeting}${profile?.full_name ? ' ' + profile.full_name : ''} ! Je suis là pour vous aider avec votre profil, vos tâches ou répondre à vos questions. Comment puis-je vous être utile aujourd'hui ?`,
      action: 'greeting'
    };
  }

  if (isThanks) {
    return {
      content: "Je vous en prie ! N'hésitez pas si vous avez besoin d'autre chose.",
      action: 'thanks'
    };
  }

  if (isFarewell) {
    return {
      content: "Au revoir ! Passez une excellente journée. N'hésitez pas à revenir si vous avez besoin d'aide.",
      action: 'goodbye'
    };
  }

  // Default response with context awareness
  return {
    content: `Je comprends votre message. ${
      !profile?.role ? "Souhaitez-vous commencer par définir votre rôle professionnel ?" :
      !profile?.bio ? "Voulez-vous me parler un peu de vous pour compléter votre bio ?" :
      !profile?.city ? "Dans quelle ville êtes-vous basé(e) ?" :
      "Comment puis-je vous aider aujourd'hui ?"
    }`,
    action: 'general_response'
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      throw new Error('Invalid user');
    }

    console.log('Processing message:', lastMessage.content);

    const profile = await getUserProfile(supabase, user.id);
    const response = generateContextualResponse(lastMessage.content, profile);

    if (response.updates) {
      const updateError = await updateUserProfile(supabase, user.id, response.updates);
      if (updateError) {
        console.error('Error updating profile:', updateError);
      }
    }

    return new Response(
      JSON.stringify({
        choices: [{
          message: {
            role: 'assistant',
            content: response.content,
            action: response.action
          }
        }]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        choices: [{
          message: {
            role: 'assistant',
            content: "Je suis désolé, j'ai rencontré une erreur. Comment puis-je vous aider autrement ?",
            action: 'error'
          }
        }]
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});