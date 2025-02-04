import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Logo } from "@/components/Logo";

export default function Auth() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-light-purple via-background to-light-blue">
      <ThemeSelector />
      
      <main className="flex-1 w-full py-8 px-4">
        <div className="container max-w-md mx-auto space-y-8">
          <div className="text-center space-y-6 animate-fade-in">
            <Logo size="lg" className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-scale-in">
              Trouvez votre prochain emploi
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Rejoignez des milliers de professionnels qui ont déjà trouvé leur emploi idéal sur Victaure
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 animate-fade-in">
            <Suspense fallback={<div>Chargement...</div>}>
              <AuthForm />
            </Suspense>
          </div>

          <div className="mt-8 animate-fade-in">
            <AuthVideo />
          </div>
        </div>
      </main>
    </div>
  );
}