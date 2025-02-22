
import { Suspense } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/sections/AuthHeader";
import { AuthFooter } from "@/components/auth/sections/AuthFooter";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { VictaureChat } from "@/components/chat/VictaureChat";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard';
    sessionStorage.removeItem('redirectTo');
    return <Navigate to={redirectTo} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="w-8 h-8 text-[#64B5D9]" />
      </div>
    );
  }

  const handleMaxQuestionsReached = () => {
    toast.error("Veuillez vous connecter pour continuer la conversation avec Mr. Victaure");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1B2A4A] relative overflow-hidden">
      {/* Logo and signature pattern */}
      <div 
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url('/lovable-uploads/bcfe3f97-9c11-4615-821e-d9666f3a9c14.png'), url('/lovable-uploads/168ba21b-e221-4668-96cc-eb026041a0ed.png')`,
          backgroundSize: "200px, 300px",
          backgroundPosition: "center",
          backgroundRepeat: "space"
        }}
      />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-xl mx-auto space-y-8">
          <AuthHeader />

          <div className="relative bg-[#D3E4FD]/80 rounded-xl p-4 backdrop-blur-sm border border-[#D3E4FD] overflow-hidden">
            <VictaureChat 
              maxQuestions={3}
              onMaxQuestionsReached={handleMaxQuestionsReached}
              context="Tu es un assistant de recrutement professionnel qui aide les utilisateurs à s'inscrire sur la plateforme Victaure. Encourage-les à créer un compte après 3 messages."
            />
          </div>

          <AuthForm />
        </div>
      </main>

      <section className="w-full bg-white/5 backdrop-blur-sm py-16">
        <PricingGrid />
      </section>

      <AuthFooter />
    </div>
  );
}
