import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { memo } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const AuthForm = memo(function AuthForm() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
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
            container: "space-y-4",
            divider: "my-4",
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
        showLinks={true}
        view="sign_in"
      />
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Rester connecté
            </label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 p-0.5"
              >
                {theme === 'dark' ? (
                  <Moon className="h-3 w-3" />
                ) : theme === 'system' ? (
                  <Monitor className="h-3 w-3" />
                ) : (
                  <Sun className="h-3 w-3" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              <DropdownMenuItem onClick={() => setTheme('light')} className="text-xs">
                <Sun className="mr-2 h-3 w-3" />
                <span>Clair</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="text-xs">
                <Moon className="mr-2 h-3 w-3" />
                <span>Sombre</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="text-xs">
                <Monitor className="mr-2 h-3 w-3" />
                <span>Système</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
});