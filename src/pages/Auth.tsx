import { AuthForm } from "@/components/auth/AuthForm";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Auth() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo size="lg" className="mb-2" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenue sur Victaure
          </h1>
          <p className="text-sm text-muted-foreground">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <div className="glass-card p-6 rounded-lg shadow-lg">
          <AuthForm />
        </div>
        
        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
          <AuthVideo />
        </div>
      </div>
    </div>
  );
}