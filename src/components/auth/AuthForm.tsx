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
              brand: '#22d3ee',
              brandAccent: '#06b6d4',
              inputBackground: 'white',
              inputText: 'rgb(75, 85, 99)',
              inputPlaceholder: 'rgb(156, 163, 175)',
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
              borderRadiusButton: '0.5rem',
              buttonBorderRadius: '0.5rem',
              inputBorderRadius: '0.5rem',
            },
            fonts: {
              bodyFontFamily: `system-ui, -apple-system, sans-serif`,
              buttonFontFamily: `system-ui, -apple-system, sans-serif`,
              inputFontFamily: `system-ui, -apple-system, sans-serif`,
            },
          },
        },
        className: {
          button: "w-full bg-[#22d3ee] hover:bg-[#06b6d4] text-white transition-colors",
          input: "w-full border border-gray-200 focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee]",
          label: "text-gray-600 font-medium",
          message: "text-sm text-gray-500",
          anchor: "text-[#22d3ee] hover:text-[#06b6d4] no-underline hover:underline",
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