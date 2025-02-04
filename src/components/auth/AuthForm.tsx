import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export function AuthForm() {
  const supabase = useSupabaseClient();

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'rgb(139, 92, 246)',
              brandAccent: 'rgb(124, 58, 237)',
              brandButtonText: 'white',
            },
            radii: {
              buttonBorderRadius: '1rem',
              inputBorderRadius: '1rem',
            },
            fonts: {
              bodyFontFamily: `'Montserrat', sans-serif`,
              buttonFontFamily: `'Montserrat', sans-serif`,
              inputFontFamily: `'Montserrat', sans-serif`,
              labelFontFamily: `'Playfair Display', serif`,
            },
          },
        },
        className: {
          button: 'hover:scale-[1.02] transition-transform duration-200 font-montserrat',
          container: 'gap-4',
          divider: 'bg-muted',
          input: 'rounded-xl bg-background border-muted font-montserrat',
          label: 'text-foreground font-playfair',
          message: 'font-montserrat',
        },
      }}
      theme="default"
      providers={["google"]}
      redirectTo={`${window.location.origin}/auth/callback`}
      magicLink={false}
      showLinks={true}
      view="sign_in"
      localization={{
        variables: {
          sign_in: {
            email_label: 'Email',
            password_label: 'Password',
          },
          sign_up: {
            email_label: 'Email',
            password_label: 'Password',
          },
        },
      }}
    />
  );
}