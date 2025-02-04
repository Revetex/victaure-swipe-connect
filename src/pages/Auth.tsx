import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { Logo } from "@/components/Logo";

export default function Auth() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-light-purple via-background to-light-blue relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      <ThemeSelector />
      
      <main className="flex-1 w-full py-12 px-4 relative z-10">
        <div className="container max-w-md mx-auto space-y-8">
          <div className="text-center space-y-6 animate-fade-in">
            <Logo size="xl" className="mx-auto" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-scale-in font-playfair">
              Trouvez votre prochain emploi
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto font-montserrat">
              Rejoignez des milliers de professionnels qui ont déjà trouvé leur emploi idéal sur Victaure
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 animate-fade-in">
            <Suspense fallback={<div>Chargement...</div>}>
              <AuthForm />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}