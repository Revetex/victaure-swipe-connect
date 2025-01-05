import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Card } from "@/components/ui/card";

export const AuthForm = memo(function AuthForm() {
  const { theme } = useTheme();

  return (
    <div className="w-full max-w-[400px] mx-auto space-y-6">
      <Card className="p-4">
        <ThemeSelector />
      </Card>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: {
            default: {
              colors: {
                brand: 'hsl(var(--primary))',
                brandAccent: 'hsl(var(--primary))',
                inputBackground: 'transparent',
                inputBorder: 'hsl(var(--border))',
                inputBorderFocus: 'hsl(var(--primary))',
                inputBorderHover: 'hsl(var(--primary))',
                inputPlaceholder: 'hsl(var(--muted-foreground))',
                messageText: 'hsl(var(--muted-foreground))',
                messageTextDanger: 'hsl(var(--destructive))',
              },
            },
          },
          className: {
            button: "w-full h-11 text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors mt-2",
            input: "w-full h-11 text-sm bg-transparent border border-border transition-colors focus:border-primary focus:outline-none",
            label: "text-sm text-foreground mb-2",
            message: "text-sm text-muted-foreground",
            anchor: "text-primary/80 no-underline hover:text-primary hover:underline transition-colors",
            container: "space-y-2",
          },
        }}
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              email_label: "Adresse e-mail",
              password_label: "Mot de passe",
              button_label: "Se connecter",
              loading_button_label: "Connexion en cours...",
              social_provider_text: "Se connecter avec {{provider}}",
              link_text: "Vous avez déjà un compte ? Connectez-vous",
            },
            sign_up: {
              email_label: "Adresse e-mail",
              password_label: "Mot de passe",
              button_label: "S'inscrire",
              loading_button_label: "Inscription en cours...",
              social_provider_text: "S'inscrire avec {{provider}}",
              link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
              confirmation_text: "Vérifiez vos e-mails pour confirmer votre inscription",
            },
            forgotten_password: {
              email_label: "Adresse e-mail",
              password_label: "Mot de passe",
              button_label: "Envoyer les instructions",
              loading_button_label: "Envoi des instructions en cours...",
              link_text: "Mot de passe oublié ?",
              confirmation_text: "Vérifiez vos e-mails pour réinitialiser votre mot de passe",
            },
          },
        }}
      />

      <div className="flex justify-between text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">
          Conditions d'utilisation
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Politique de confidentialité
        </a>
      </div>
    </div>
  );
});