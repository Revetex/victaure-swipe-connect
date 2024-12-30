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
        style: {
          container: {
            width: '100%',
          },
          button: {
            width: '100%',
            height: '2.75rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          input: {
            width: '100%',
            height: '2.75rem',
            fontSize: '0.875rem',
            backgroundColor: 'transparent',
            border: '1px solid hsl(var(--border))',
          },
          label: {
            fontSize: '0.875rem',
            color: 'hsl(var(--foreground))',
            marginBottom: '0.5rem',
          },
          message: {
            fontSize: '0.875rem',
            color: 'hsl(var(--muted-foreground))',
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
          },
          sign_up: {
            email_label: "Email",
            password_label: "Mot de passe",
            button_label: "S'inscrire",
            email_input_placeholder: "Votre adresse email",
            password_input_placeholder: "Choisissez un mot de passe",
          },
        },
      }}
      theme={theme === "dark" ? "dark" : "light"}
      redirectTo={window.location.origin}
    />
  );
}