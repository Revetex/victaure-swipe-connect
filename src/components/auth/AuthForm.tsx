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
              brand: 'rgb(30, 174, 219)',
              brandAccent: 'rgb(15, 160, 206)',
              inputBackground: 'transparent',
              inputText: 'hsl(var(--foreground))',
              inputPlaceholder: 'hsl(var(--muted-foreground))',
            },
            space: {
              inputPadding: '1rem',
              buttonPadding: '1.25rem',
            },
            borderWidths: {
              buttonBorderWidth: '1px',
              inputBorderWidth: '1px',
            },
            radii: {
              borderRadiusButton: '0.5rem',
              buttonBorderRadius: '0.5rem',
              inputBorderRadius: '0.5rem',
            },
            fonts: {
              bodyFontFamily: `var(--font-sans)`,
              buttonFontFamily: `var(--font-sans)`,
              inputFontFamily: `var(--font-sans)`,
            },
          },
        },
        className: {
          button: "w-full h-11 text-sm font-medium transition-all hover:-translate-y-[1px]",
          input: "w-full h-11 text-sm bg-transparent border border-border transition-colors focus:border-primary focus:outline-none",
          label: "text-sm text-foreground mb-2",
          message: "text-sm text-muted-foreground",
          anchor: "text-primary no-underline hover:underline",
        },
      }}
      providers={[]}
      redirectTo={window.location.origin + "/dashboard"}
      localization={{
        variables: {
          sign_up: {
            email_label: "Email",
            password_label: "Mot de passe",
            button_label: "S'inscrire",
            email_input_placeholder: "Votre adresse email",
            password_input_placeholder: "Choisissez un mot de passe",
            link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
          },
          sign_in: {
            email_label: "Email",
            password_label: "Mot de passe",
            button_label: "Se connecter",
            email_input_placeholder: "Votre adresse email",
            password_input_placeholder: "Votre mot de passe",
            link_text: "Vous avez déjà un compte ? Connectez-vous",
          },
          forgotten_password: {
            button_label: "Réinitialiser le mot de passe",
            link_text: "Mot de passe oublié ?",
          },
        },
      }}
      view="sign_up"
      showLinks={true}
    />
  );
});