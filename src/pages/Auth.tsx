import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/Logo";
import { VideoPlayer } from "@/components/auth/VideoPlayer";

export default function Auth() {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (session) {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("User verification error:", userError);
            await supabase.auth.signOut();
            return;
          }

          if (user) {
            console.log("User already logged in, redirecting to dashboard");
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Erreur lors de la vérification de l'authentification");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        toast.success("Connexion réussie");
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur de chargement vidéo:", e);
    const video = e.target as HTMLVideoElement;
    console.log("Video source:", video.currentSrc);
    console.log("Video ready state:", video.readyState);
    console.log("Video network state:", video.networkState);
    console.log("Video error:", video.error?.message);
    setVideoError(true);
  };

  return (
    <div className="min-h-[100dvh] bg-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dashboard-pattern opacity-5" />
      
      {/* Content */}
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <Logo size="lg" className="mb-2" />
            <h1 className="text-2xl font-bold tracking-tight">Bienvenue sur Victaure</h1>
            <p className="text-sm text-muted-foreground">
              Connectez-vous ou créez un compte pour continuer
            </p>
          </div>

          {/* Auth Card */}
          <div className="glass-card w-full space-y-6 rounded-xl border bg-card/50 p-6 shadow-sm backdrop-blur-sm">
            <AuthForm />
          </div>

          {/* Video Section */}
          {videoError ? (
            <div className="mt-8 w-full aspect-video bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
              <p>La vidéo n'a pas pu être chargée</p>
            </div>
          ) : (
            <VideoPlayer 
              onError={handleVideoError}
              onLoad={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}