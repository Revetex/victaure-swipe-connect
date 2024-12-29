import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Get user profile for more context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const questions = {
      role: "Quelle est votre profession actuelle ?",
      bio: "Pouvez-vous me parler un peu de vous et de votre parcours ?",
      city: "Dans quelle ville êtes-vous basé(e) ?",
      skills: "Quelles sont vos principales compétences professionnelles ?",
    };

    const profileUpdates: any = {};
    let response = { 
      content: "Je ne comprends pas votre demande. Comment puis-je vous aider aujourd'hui ?", 
      action: 'offer_help' 
    };

    if (lastMessage.role === 'user') {
      const content = lastMessage.content.toLowerCase();
      
      // Analyze message intent
      if (content.includes('bonjour') || content.includes('salut') || content.includes('hello')) {
        const greeting = profile?.full_name 
          ? `Bonjour ${profile.full_name} ! `
          : "Bonjour ! ";
        response = {
          content: `${greeting}Je suis Mr Victaure, votre assistant. Je peux vous aider à mettre à jour votre profil, gérer vos tâches ou répondre à vos questions. Que puis-je faire pour vous ?`,
          action: 'greeting'
        };
      }
      else if (content.includes('modifier') || content.includes('mettre à jour') || content.includes('changer')) {
        if (content.includes('profil')) {
          response = {
            content: "Je vais vous aider à mettre à jour votre profil. " + questions.role,
            action: 'ask_role'
          };
        } else if (content.includes('compétence')) {
          response = {
            content: "Bien sûr ! " + questions.skills,
            action: 'ask_skills'
          };
        } else {
          response = {
            content: "Que souhaitez-vous modifier exactement ? Je peux vous aider avec votre profil, vos compétences, ou d'autres informations.",
            action: 'ask_what_to_update'
          };
        }
      }
      else if (content.includes('merci')) {
        response = {
          content: "Je vous en prie ! N'hésitez pas si vous avez besoin d'autre chose.",
          action: 'thanks'
        };
      }
      else if (content.includes('au revoir') || content.includes('bye')) {
        response = {
          content: "Au revoir ! N'hésitez pas à revenir si vous avez besoin d'aide.",
          action: 'goodbye'
        };
      }
      else if (messages.length >= 2 && messages[messages.length - 2].role === 'assistant') {
        const previousQuestion = messages[messages.length - 2].content;
        
        if (previousQuestion.includes(questions.role)) {
          profileUpdates.role = lastMessage.content;
          response = {
            content: `Merci ! ${profile?.bio ? "Souhaitez-vous mettre à jour votre bio ?" : questions.bio}`,
            action: 'ask_bio'
          };
        }
        else if (previousQuestion.includes(questions.bio)) {
          profileUpdates.bio = lastMessage.content;
          response = {
            content: `${profile?.city ? "Votre ville actuelle est ${profile.city}. Souhaitez-vous la modifier ?" : questions.city}`,
            action: 'ask_city'
          };
        }
        else if (previousQuestion.includes(questions.city)) {
          profileUpdates.city = lastMessage.content;
          response = {
            content: `${profile?.skills?.length ? "Vos compétences actuelles sont : " + profile.skills.join(", ") + ". Souhaitez-vous les mettre à jour ?" : questions.skills}`,
            action: 'ask_skills'
          };
        }
        else if (previousQuestion.includes(questions.skills)) {
          profileUpdates.skills = lastMessage.content.split(',').map((s: string) => s.trim());
          response = {
            content: "Parfait ! J'ai mis à jour votre profil avec toutes ces informations. Vous pouvez vérifier les changements sur votre VCard. Avez-vous besoin d'autre chose ?",
            action: 'update_complete'
          };
        }
      }

      if (Object.keys(profileUpdates).length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', user.id);

        if (updateError) {
          throw updateError;
        }
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
            content: "Désolé, j'ai rencontré une erreur. Comment puis-je vous aider autrement ?",
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