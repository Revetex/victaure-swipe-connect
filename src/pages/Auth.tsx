import { AuthForm } from "@/components/auth/AuthForm";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Auth() {
  return (
    <div className="auth-container">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="auth-card space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo size="lg" className="mb-2" />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Bienvenue sur Victaure
          </h1>
          <p className="text-sm text-muted-foreground">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <AuthForm />
        
        <div className="relative mt-8">
          <AuthVideo />
        </div>
      </div>
    </div>
  );
}