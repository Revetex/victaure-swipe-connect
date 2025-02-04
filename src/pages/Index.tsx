import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Briefcase, Shield, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Index() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Briefcase,
      title: "Opportunités Ciblées",
      description: "Accédez à des missions parfaitement adaptées à vos compétences grâce à notre IA."
    },
    {
      icon: Shield,
      title: "Profil Professionnel",
      description: "Créez votre carte de visite numérique et partagez-la facilement."
    },
    {
      icon: Zap,
      title: "Matching Intelligent",
      description: "Notre algorithme trouve les meilleures correspondances pour votre profil."
    },
    {
      icon: Users,
      title: "Réseau Professionnel",
      description: "Connectez-vous avec d'autres professionnels de votre domaine."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/50">
      {/* Logo and Title */}
      <div className="text-center pt-8">
        <div className="flex justify-center mb-4">
          <Logo size="lg" showText={false} />
        </div>
        <h1 className="text-6xl font-bold text-[#9b87f5] dark:text-[#D6BCFA]">VICTAURE</h1>
      </div>

      {/* Hero Section with Video */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-left"
            >
              <img 
                src="/lovable-uploads/1af16883-f185-44b3-af14-6740c1358a27.png" 
                alt="Victaure Logo" 
                className="w-48 mb-8"
              />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                Votre Carrière, <br/>
                <span className="text-[#9b87f5] dark:text-[#D6BCFA]">Notre Mission</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Trouvez les meilleures opportunités professionnelles grâce à notre plateforme alimentée par l'intelligence artificielle.
              </p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-[#9b87f5] hover:bg-[#7E69AB] dark:bg-[#D6BCFA] dark:hover:bg-[#7E69AB] text-white px-8"
                >
                  Commencer Maintenant
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth?mode=signup")}
                  className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10 dark:border-[#D6BCFA] dark:text-[#D6BCFA] dark:hover:bg-[#D6BCFA]/10"
                >
                  Inscription
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative rounded-xl overflow-hidden shadow-2xl"
            >
              <video
                controls
                playsInline
                className="w-full h-full object-cover rounded-xl"
              >
                <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background dark:bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pourquoi Choisir <span className="text-[#9b87f5] dark:text-[#D6BCFA]">Victaure</span> ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre plateforme combine technologie avancée et simplicité d'utilisation pour propulser votre carrière.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-card dark:bg-card rounded-xl hover:shadow-lg transition-all duration-300 border border-border"
              >
                <div className="w-12 h-12 bg-[#9b87f5]/10 dark:bg-[#D6BCFA]/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[#9b87f5] dark:text-[#D6BCFA]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background dark:bg-background">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Prêt à Booster Votre Carrière ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Rejoignez Victaure aujourd'hui et accédez à des opportunités professionnelles uniques.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth?mode=signup")}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] dark:bg-[#D6BCFA] dark:hover:bg-[#7E69AB] text-white px-8"
          >
            Créer Mon Compte
          </Button>
        </div>
      </section>

      {/* Footer with Legal Information */}
      <footer className="bg-background/80 dark:bg-background/80 py-8 px-4 mt-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <p className="text-muted-foreground">
                Email: <br />
                <a href="mailto:admin@victaure.com" className="text-[#9b87f5] hover:underline">admin@victaure.com</a>
                <br />
                <a href="mailto:tblanchet3909@hotmail.com" className="text-[#9b87f5] hover:underline">tblanchet3909@hotmail.com</a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Mentions Légales</h3>
              <p className="text-muted-foreground text-sm">
                © 2024 Victaure. Tous droits réservés.<br />
                Toute reproduction interdite sans autorisation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Politique de Confidentialité</h3>
              <p className="text-muted-foreground text-sm">
                Nous nous engageons à protéger vos données personnelles.<br />
                <a href="#" className="text-[#9b87f5] hover:underline">Lire notre politique de confidentialité</a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Conditions d'Utilisation</h3>
              <p className="text-muted-foreground text-sm">
                En utilisant nos services, vous acceptez nos conditions.<br />
                <a href="#" className="text-[#9b87f5] hover:underline">Voir les conditions d'utilisation</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}