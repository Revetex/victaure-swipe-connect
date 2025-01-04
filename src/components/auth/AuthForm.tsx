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
              brand: '#0ea5e9',
              brandAccent: '#0284c7',
              inputBackground: theme === 'dark' ? 'rgb(17, 17, 17)' : 'white',
              inputText: theme === 'dark' ? 'rgb(229, 231, 235)' : 'rgb(75, 85, 99)',
              inputPlaceholder: theme === 'dark' ? 'rgb(156, 163, 175, 0.5)' : 'rgb(156, 163, 175)',
              inputBorder: theme === 'dark' ? 'rgb(64, 64, 64)' : 'rgb(229, 231, 235)',
              inputBorderHover: theme === 'dark' ? 'rgb(82, 82, 82)' : 'rgb(209, 213, 219)',
              inputBorderFocus: '#0ea5e9',
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
          button: "w-full bg-sky-500 hover:bg-sky-600 text-white transition-colors",
          input: `w-full border focus:border-sky-500 focus:ring-1 focus:ring-sky-500 
                 ${theme === 'dark' ? 'bg-neutral-900 border-neutral-700 text-gray-200' : 'bg-white border-gray-200 text-gray-700'}`,
          label: "text-gray-600 dark:text-gray-300 font-medium",
          message: "text-sm text-gray-500 dark:text-gray-400",
          anchor: "text-sky-500 hover:text-sky-600 no-underline hover:underline",
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