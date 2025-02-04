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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Video */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-left"
            >
              <Logo size="lg" className="mb-8 text-[#9b87f5]" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Votre Carrière, <br/>
                <span className="text-[#9b87f5]">Notre Mission</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Trouvez les meilleures opportunités professionnelles grâce à notre plateforme alimentée par l'intelligence artificielle.
              </p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-8"
                >
                  Commencer Maintenant
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative rounded-xl overflow-hidden shadow-2xl"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-xl"
              >
                <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir <span className="text-[#9b87f5]">Victaure</span> ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-[#9b87f5]/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[#9b87f5]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#9b87f5]/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-3xl font-bold text-[#9b87f5] mb-2">10,000+</h3>
              <p className="text-gray-600">Professionnels Actifs</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-3xl font-bold text-[#9b87f5] mb-2">2,500+</h3>
              <p className="text-gray-600">Missions Disponibles</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-3xl font-bold text-[#9b87f5] mb-2">95%</h3>
              <p className="text-gray-600">Taux de Satisfaction</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-3xl font-bold text-[#9b87f5] mb-2">24/7</h3>
              <p className="text-gray-600">Support Disponible</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Prêt à Booster Votre Carrière ?
          </h2>
          <p className="text-gray-600 mb-8">
            Rejoignez Victaure aujourd'hui et accédez à des opportunités professionnelles uniques.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-8"
          >
            Créer Mon Compte
          </Button>
        </div>
      </section>
    </div>
  );
}