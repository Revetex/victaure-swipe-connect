import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";

export function AuthForm() {
  const { theme } = useTheme();

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'hsl(var(--primary))',
              brandAccent: 'hsl(var(--primary))',
              inputBackground: 'transparent',
              inputText: 'hsl(var(--foreground))',
              inputPlaceholder: 'hsl(var(--muted-foreground))',
              inputBorder: 'hsl(var(--border))',
              inputBorderFocus: 'hsl(var(--ring))',
              inputBorderHover: 'hsl(var(--border))',
              anchorTextColor: 'hsl(var(--primary))',
              anchorTextHoverColor: 'hsl(var(--primary))',
              dividerBackground: 'hsl(var(--border))',
            },
            space: {
              inputPadding: '1rem',
              buttonPadding: '1.25rem',
              spaceSmall: '0.5rem',
              spaceMedium: '1rem',
              spaceLarge: '1.5rem',
              labelBottomMargin: '0.5rem',
              anchorBottomMargin: '0.5rem',
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
              labelFontFamily: `var(--font-sans)`,
            },
          },
        },
        style: {
          container: {
            width: '100%',
          },
          button: {
            width: '100%',
            height: '2.75rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 150ms',
            opacity: 1,
            backgroundColor: '#1EAEDB',
            color: 'white',
            hover: {
              opacity: 0.9,
              backgroundColor: '#0FA0CE',
            },
          },
          input: {
            width: '100%',
            height: '2.75rem',
            fontSize: '0.875rem',
            backgroundColor: 'transparent',
            border: '1px solid hsl(var(--border))',
            transition: 'border-color 150ms',
            focus: {
              borderColor: 'hsl(var(--ring))',
              outline: 'none',
            },
          },
          label: {
            fontSize: '0.875rem',
            color: 'hsl(var(--foreground))',
            marginBottom: '0.5rem',
            fontWeight: 500,
          },
          message: {
            fontSize: '0.875rem',
            color: 'hsl(var(--muted-foreground))',
            marginTop: '0.5rem',
          },
          anchor: {
            fontSize: '0.875rem',
            color: 'hsl(var(--primary))',
            textDecoration: 'none',
            hover: {
              textDecoration: 'underline',
            },
          },
          divider: {
            backgroundColor: 'hsl(var(--border))',
            margin: '1.5rem 0',
          },
        },
      }}
      providers={[]}
      localization={{
        variables: {
          sign_in: {
            email_label: "Email",
            password_label: "Mot de passe",
            button_label: "Se connecter",
            email_input_placeholder: "Votre adresse email",
            password_input_placeholder: "Votre mot de passe",
            link_text: "Déjà inscrit ? Connectez-vous",
            loading_button_label: "Connexion en cours...",
          },
          sign_up: {
            email_label: "Email",
            password_label: "Mot de passe",
            button_label: "S'inscrire",
            email_input_placeholder: "Votre adresse email",
            password_input_placeholder: "Choisissez un mot de passe",
            link_text: "Pas encore inscrit ? Créez un compte",
            loading_button_label: "Inscription en cours...",
          },
          forgotten_password: {
            email_label: "Email",
            password_label: "Mot de passe",
            button_label: "Réinitialiser le mot de passe",
            email_input_placeholder: "Votre adresse email",
            link_text: "Mot de passe oublié ?",
            loading_button_label: "Envoi en cours...",
          },
        },
      }}
    />
  );
}