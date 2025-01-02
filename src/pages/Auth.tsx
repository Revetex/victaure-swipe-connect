import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/Logo";
import { Play } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVideoPaused, setIsVideoPaused] = useState(true);

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
        navigate("/dashboard", { replace: true });
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

  const handlePlayPause = (video: HTMLVideoElement) => {
    if (video.paused) {
      video.play();
      setIsVideoPaused(false);
    }
  };

  const handleVideoStateChange = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.target as HTMLVideoElement;
    setIsVideoPaused(video.paused);
  };

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-auto">
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
            <BiometricAuth />
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/50 px-2 text-muted-foreground backdrop-blur-sm">
                  ou continuez avec
                </span>
              </div>
            </div>

            {/* Auth Form */}
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
                  preload="metadata"
                  controls
                  onError={handleVideoError}
                  onLoadedData={handleVideoLoad}
                  onPlay={() => setIsVideoPaused(false)}
                  onPause={() => setIsVideoPaused(true)}
                  onSeeking={(e) => e.currentTarget.play()}
                  onTimeUpdate={handleVideoStateChange}
                >
                  <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                
                {/* Custom Video Overlay */}
                {isVideoPaused && (
                  <div 
                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 cursor-pointer transition-opacity duration-300"
                    onClick={(e) => {
                      const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                      handlePlayPause(video);
                    }}
                  >
                    <Logo size="lg" className="text-white" />
                    <p className="text-white text-xl font-semibold">
                      Découvrez Victaure en vidéo
                    </p>
                    <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8 text-white" />
                    </div>
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