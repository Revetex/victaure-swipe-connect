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
            borderRadii: {
              button: '1rem',
              input: '1rem',
            },
          },
        },
        className: {
          button: 'hover:scale-[1.02] transition-transform duration-200',
          container: 'gap-4',
          divider: 'bg-muted',
          input: 'rounded-xl bg-background border-muted',
          label: 'text-foreground',
        },
      }}
      theme="default"
      providers={["google"]}
      redirectTo={`${window.location.origin}/auth/callback`}
    />
  );
}