import { motion } from "framer-motion";
import { Briefcase, Shield, Zap, Users } from "lucide-react";

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

export function FeaturesSection() {
  return (
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
  );
}