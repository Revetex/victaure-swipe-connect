import { HeroSection } from "@/components/landing/HeroSection";
import { Footer } from "@/components/landing/Footer";
import { DownloadApp } from "@/components/dashboard/DownloadApp";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="relative z-10">
        <HeroSection />
        
        {/* Video Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AuthVideo />
            </div>
          </div>
        </section>

        {/* App Features Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Découvrez Notre Application</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Une plateforme complète pour gérer votre carrière et vos services professionnels
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 rounded-lg bg-card">
                <h3 className="text-xl font-semibold mb-3">Gestion de Profil</h3>
                <p className="text-muted-foreground">Créez et personnalisez votre profil professionnel pour vous démarquer</p>
              </div>
              <div className="p-6 rounded-lg bg-card">
                <h3 className="text-xl font-semibold mb-3">Recherche d'Emploi</h3>
                <p className="text-muted-foreground">Trouvez les meilleures opportunités adaptées à vos compétences</p>
              </div>
              <div className="p-6 rounded-lg bg-card">
                <h3 className="text-xl font-semibold mb-3">Services Professionnels</h3>
                <p className="text-muted-foreground">Proposez ou trouvez des services de qualité dans votre domaine</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth?mode=signin")}
                className="bg-primary hover:bg-primary/90"
              >
                Connexion
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/auth?mode=signup")}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Inscription
              </Button>
            </div>
          </div>
        </section>

        <div className="relative">
          <div className="absolute inset-0 bg-[#9b87f5]/5 dark:bg-[#D6BCFA]/5 transform -skew-y-3" />
          <div className="relative overflow-hidden">
            <div className="container mx-auto px-4 py-16 sm:py-24">
              <DownloadApp />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}