import { motion } from "framer-motion";
import { 
  Brain, 
  Target, 
  Rocket,
  Users,
  Shield,
  TrendingUp,
  Sparkles,
  MessageSquare
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "IA Prédictive Avancée",
      description: "Notre algorithme analyse en temps réel les tendances du marché pour vous proposer les meilleures opportunités."
    },
    {
      icon: Target,
      title: "Matching Intelligent",
      description: "Un système de correspondance précis qui comprend vos compétences et aspirations professionnelles."
    },
    {
      icon: Rocket,
      title: "Boost de Carrière",
      description: "Des conseils personnalisés et des stratégies d'évolution pour accélérer votre progression."
    },
    {
      icon: Users,
      title: "Réseau Professionnel",
      description: "Connectez-vous avec des professionnels partageant vos ambitions et élargissez votre réseau."
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Protection avancée de vos données personnelles et professionnelles."
    },
    {
      icon: TrendingUp,
      title: "Analyse Prédictive",
      description: "Anticipez les tendances du marché grâce à notre IA."
    },
    {
      icon: Sparkles,
      title: "Personnalisation",
      description: "Une expérience sur mesure adaptée à votre profil unique."
    },
    {
      icon: MessageSquare,
      title: "Support 24/7",
      description: "Une équipe dédiée à votre réussite professionnelle."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background via-purple-900/10 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#D6BCFA] bg-clip-text text-transparent">
            Une Technologie au Service de Votre Réussite
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment notre plateforme révolutionne la recherche d'emploi et le développement de carrière
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-8 rounded-xl text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-[#9b87f5]/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 rounded-xl max-w-3xl mx-auto transform hover:scale-105 transition-transform duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="bg-[#9b87f5]/10 p-2 rounded-lg">
                  <benefit.icon className="w-6 h-6 text-[#9b87f5]" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}