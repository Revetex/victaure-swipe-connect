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
              brand: '#0EA5E9',
              brandAccent: '#0284C7',
              inputBackground: theme === 'dark' ? '#0F172A' : 'white',
              inputText: theme === 'dark' ? '#F9FAFB' : 'rgb(75, 85, 99)',
              inputPlaceholder: theme === 'dark' ? '#6B7280' : 'rgb(156, 163, 175)',
              inputBorder: theme === 'dark' ? '#1E293B' : 'rgb(229, 231, 235)',
              inputBorderHover: theme === 'dark' ? '#334155' : 'rgb(209, 213, 219)',
              inputBorderFocus: '#0EA5E9',
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
          button: "w-full bg-cyan-500 hover:bg-cyan-600 text-white transition-colors",
          input: `w-full border focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 
                 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-gray-100' : 'bg-white border-gray-200 text-gray-700'}`,
          label: "text-gray-600 dark:text-gray-300 font-medium",
          message: "text-sm text-gray-500 dark:text-gray-400",
          anchor: "text-cyan-500 hover:text-cyan-600 no-underline hover:underline",
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