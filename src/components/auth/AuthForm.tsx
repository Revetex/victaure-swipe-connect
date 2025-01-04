import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { memo } from "react";

export const AuthForm = memo(function AuthForm() {
  const { theme } = useTheme();

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#9b87f5',
              brandAccent: '#7E69AB',
              inputBackground: theme === 'dark' ? '#0F172A' : 'white',
              inputText: theme === 'dark' ? '#F9FAFB' : '#1A1F2C',
              inputPlaceholder: theme === 'dark' ? '#6B7280' : '#8E9196',
              inputBorder: theme === 'dark' ? '#1E293B' : '#E5E7EB',
              inputBorderHover: theme === 'dark' ? '#334155' : '#D1D5DB',
              inputBorderFocus: '#9b87f5',
            },
            space: {
              inputPadding: '1rem',
              buttonPadding: '1rem',
            },
            borderWidths: {
              buttonBorderWidth: '0px',
              inputBorderWidth: '1px',
            },
            radii: {
              borderRadiusButton: '0.75rem',
              buttonBorderRadius: '0.75rem',
              inputBorderRadius: '0.75rem',
            },
            fonts: {
              bodyFontFamily: `system-ui, -apple-system, sans-serif`,
              buttonFontFamily: `system-ui, -apple-system, sans-serif`,
              inputFontFamily: `system-ui, -apple-system, sans-serif`,
            },
          },
        },
        className: {
          button: "w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors",
          input: `w-full border focus:border-[#9b87f5] focus:ring-1 focus:ring-[#9b87f5] 
                 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-gray-100' : 'bg-white border-gray-200 text-[#1A1F2C]'}`,
          label: "text-[#1A1F2C] dark:text-gray-300 font-medium",
          message: "text-sm text-[#8E9196] dark:text-gray-400",
          anchor: "text-[#9b87f5] hover:text-[#7E69AB] no-underline hover:underline",
        },
      }}
      providers={[]}
      redirectTo={window.location.origin + "/dashboard"}
      localization={{
        variables: {
          sign_in: {
            email_label: "Email",
            password_label: "Mot de passe",
            button_label: "Se connecter",
            email_input_placeholder: "Votre adresse email",
            password_input_placeholder: "Votre mot de passe",
            link_text: "Vous avez déjà un compte ? Connectez-vous",
          },
          sign_up: {
            email_label: "Email",
            password_label: "Mot de passe",
            button_label: "S'inscrire",
            email_input_placeholder: "Votre adresse email",
            password_input_placeholder: "Choisissez un mot de passe",
            link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
          },
          forgotten_password: {
            button_label: "Réinitialiser le mot de passe",
            link_text: "Mot de passe oublié ?",
          },
        },
      }}
    />
  );
});