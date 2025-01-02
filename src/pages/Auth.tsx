import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/Logo";
import { Play } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

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
    setIsVideoLoading(false);
  };

  const handleVideoLoad = () => {
    console.log("Vidéo chargée avec succès");
    setIsVideoLoading(false);
  };

  const handlePlayClick = () => {
    const video = document.querySelector('video');
    if (video) {
      video.play();
      setIsPlaying(true);
    }
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
          <div className="mt-8 w-full rounded-xl overflow-hidden shadow-lg relative">
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            {videoError ? (
              <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                <p>La vidéo n'a pas pu être chargée</p>
              </div>
            ) : (
              <div className="relative">
                <video
                  className="w-full aspect-video object-cover"
                  loop
                  muted
                  playsInline
                  preload="auto"
                  controls={isPlaying}
                  onError={handleVideoError}
                  onLoadedData={handleVideoLoad}
                >
                  <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer group"
                    onClick={handlePlayClick}
                  >
                    <Logo size="lg" className="mb-4 opacity-75" />
                    <div className="bg-primary/90 rounded-full p-4 transform transition-transform group-hover:scale-110">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <p className="mt-4 text-white font-medium">Découvrez Victaure en vidéo</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}