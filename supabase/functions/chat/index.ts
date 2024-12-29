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

    console.log('Processing message:', lastMessage.content);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const profileUpdates: any = {};
    let response = { content: '', action: '' };

    if (lastMessage.role === 'user') {
      const content = lastMessage.content.toLowerCase();
      
      // Analyze message intent and context
      const isGreeting = /^(bonjour|salut|allo|hey|hi|hello)/i.test(content);
      const isThanks = /merci|thanks|thank you/i.test(content);
      const isFarewell = /au revoir|bye|ciao|à \+|a \+/i.test(content);
      const isProfileUpdate = /modifier|changer|mettre à jour|update/i.test(content);
      const isQuestion = /\?$/.test(content) || /^(comment|pourquoi|quand|où|qui|que|quoi|est-ce)/i.test(content);
      
      if (isGreeting) {
        const timeOfDay = new Date().getHours();
        let greeting = '';
        
        if (timeOfDay < 12) greeting = 'Bonjour';
        else if (timeOfDay < 18) greeting = 'Bon après-midi';
        else greeting = 'Bonsoir';

        response = {
          content: `${greeting}${profile?.full_name ? ' ' + profile.full_name : ''} ! Je suis Mr Victaure, votre assistant. Je peux vous aider avec votre profil, vos tâches ou répondre à vos questions. Que puis-je faire pour vous ?`,
          action: 'greeting'
        };
      }
      else if (isThanks) {
        response = {
          content: "Je vous en prie ! N'hésitez pas si vous avez besoin d'autre chose.",
          action: 'thanks'
        };
      }
      else if (isFarewell) {
        response = {
          content: "Au revoir ! Passez une excellente journée. N'hésitez pas à revenir si vous avez besoin d'aide.",
          action: 'goodbye'
        };
      }
      else if (isProfileUpdate) {
        if (content.includes('profil')) {
          response = {
            content: `D'accord, je vais vous aider à mettre à jour votre profil. Que souhaitez-vous modifier ? ${!profile?.role ? "Commençons par votre rôle professionnel." : "Votre rôle, vos compétences, ou d'autres informations ?"}`,
            action: 'ask_what_to_update'
          };
        } else if (content.includes('compétence') || content.includes('competence') || content.includes('skill')) {
          response = {
            content: `Bien sûr ! Quelles sont vos principales compétences professionnelles ? ${profile?.skills?.length ? "Actuellement, vous avez listé : " + profile.skills.join(", ") : ""}`,
            action: 'ask_skills'
          };
        } else {
          response = {
            content: "Que souhaitez-vous modifier exactement ? Je peux vous aider avec votre profil, vos compétences, ou d'autres informations.",
            action: 'ask_what_to_update'
          };
        }
      }
      else if (isQuestion) {
        if (content.includes('faire') || content.includes('aider')) {
          response = {
            content: "Je peux vous aider de plusieurs façons : mettre à jour votre profil professionnel, gérer vos tâches, répondre à vos questions sur le fonctionnement de la plateforme, ou vous donner des conseils pour votre recherche d'emploi. Que souhaitez-vous explorer ?",
            action: 'explain_capabilities'
          };
        } else if (content.includes('profil')) {
          response = {
            content: "Votre profil est votre carte de visite numérique. Je peux vous aider à le mettre à jour avec vos compétences, expériences, et informations professionnelles. Souhaitez-vous y apporter des modifications ?",
            action: 'explain_profile'
          };
        } else {
          response = {
            content: "Je vais essayer de répondre à votre question. Pourriez-vous me donner plus de détails sur ce que vous souhaitez savoir ?",
            action: 'ask_for_clarification'
          };
        }
      }
      else {
        // Check if the message might be updating profile information
        if (messages.length >= 2) {
          const previousMessage = messages[messages.length - 2].content;
          
          if (previousMessage.includes("rôle professionnel")) {
            profileUpdates.role = lastMessage.content;
            response = {
              content: `Merci ! ${profile?.bio ? "Souhaitez-vous mettre à jour votre bio ?" : "Pouvez-vous me parler un peu de vous et de votre parcours ?"}`,
              action: 'ask_bio'
            };
          }
          else if (previousMessage.includes("parcours") || previousMessage.includes("bio")) {
            profileUpdates.bio = lastMessage.content;
            response = {
              content: `${profile?.city ? `Votre ville actuelle est ${profile.city}. Souhaitez-vous la modifier ?` : "Dans quelle ville êtes-vous basé(e) ?"}`,
              action: 'ask_city'
            };
          }
          else if (previousMessage.includes("ville")) {
            profileUpdates.city = lastMessage.content;
            response = {
              content: `${profile?.skills?.length ? "Vos compétences actuelles sont : " + profile.skills.join(", ") + ". Souhaitez-vous les mettre à jour ?" : "Quelles sont vos principales compétences professionnelles ?"}`,
              action: 'ask_skills'
            };
          }
          else if (previousMessage.includes("compétences")) {
            profileUpdates.skills = lastMessage.content.split(',').map((s: string) => s.trim());
            response = {
              content: "Parfait ! J'ai mis à jour votre profil avec toutes ces informations. Vous pouvez vérifier les changements sur votre VCard. Avez-vous besoin d'autre chose ?",
              action: 'update_complete'
            };
          }
          else {
            response = {
              content: "Je comprends. Comment puis-je vous aider plus précisément ? Je peux vous assister avec la mise à jour de votre profil, la gestion de vos tâches, ou répondre à vos questions.",
              action: 'offer_help'
            };
          }
        } else {
          response = {
            content: "Je suis là pour vous aider. Voulez-vous mettre à jour votre profil, gérer vos tâches, ou avez-vous des questions spécifiques ?",
            action: 'offer_help'
          };
        }
      }

      if (Object.keys(profileUpdates).length > 0) {
        console.log('Updating profile with:', profileUpdates);
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