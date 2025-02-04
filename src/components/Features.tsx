import { motion } from "framer-motion";
import { 
  Brain, 
  Briefcase, 
  Building2, 
  FileSearch, 
  MessageSquare, 
  Network, 
  Rocket,
  Users2,
  Sparkles
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-background/95 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 bg-clip-text text-transparent font-playfair">
            Une Solution Complète pour Votre Carrière
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-montserrat">
            Découvrez comment Victaure révolutionne la recherche d'emploi dans le secteur de la construction au Québec
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            {
              icon: Brain,
              title: "IA Avancée",
              description: "Assistant intelligent spécialisé dans le domaine de la construction"
            },
            {
              icon: FileSearch,
              title: "Recherche Intelligente",
              description: "Trouvez les meilleures opportunités adaptées à votre profil"
            },
            {
              icon: MessageSquare,
              title: "Chat en Direct",
              description: "Communiquez directement avec les employeurs potentiels"
            },
            {
              icon: Network,
              title: "Réseau Professionnel",
              description: "Développez votre réseau dans l'industrie de la construction"
            },
            {
              icon: Building2,
              title: "Projets Exclusifs",
              description: "Accédez à des opportunités uniques dans la construction"
            },
            {
              icon: Users2,
              title: "Communauté Active",
              description: "Échangez avec d'autres professionnels du secteur"
            },
            {
              icon: Briefcase,
              title: "Gestion de Carrière",
              description: "Outils complets pour gérer votre progression professionnelle"
            },
            {
              icon: Rocket,
              title: "Innovation Continue",
              description: "Restez à la pointe des nouvelles opportunités du secteur"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="glass-card p-6 rounded-xl hover:scale-105 transition-transform duration-300"
              whileHover={{
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.2)",
              }}
            >
              <feature.icon className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 rounded-xl max-w-3xl mx-auto transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4 font-playfair flex items-center justify-center gap-2">
              Prêt à Transformer Votre Carrière?
              <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
            </h3>
            <p className="text-muted-foreground mb-6 font-montserrat">
              Rejoignez des milliers de professionnels qui font confiance à Victaure pour leur développement professionnel
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-full transition-colors font-semibold"
            >
              Commencer Maintenant
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}