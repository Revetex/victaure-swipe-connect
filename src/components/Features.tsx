import { motion } from "framer-motion";
import { 
  Brain, 
  Briefcase, 
  Building2, 
  FileSearch, 
  MessageSquare, 
  Network, 
  Rocket,
  Users2
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-playfair">
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
          <motion.div variants={item} className="glass-card p-6 rounded-xl">
            <Brain className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">IA Avancée</h3>
            <p className="text-muted-foreground">Assistant intelligent spécialisé dans le domaine de la construction</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-6 rounded-xl">
            <FileSearch className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Recherche Intelligente</h3>
            <p className="text-muted-foreground">Trouvez les meilleures opportunités adaptées à votre profil</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-6 rounded-xl">
            <MessageSquare className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chat en Direct</h3>
            <p className="text-muted-foreground">Communiquez directement avec les employeurs potentiels</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-6 rounded-xl">
            <Network className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Réseau Professionnel</h3>
            <p className="text-muted-foreground">Développez votre réseau dans l'industrie de la construction</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-6 rounded-xl">
            <Building2 className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Projets Exclusifs</h3>
            <p className="text-muted-foreground">Accédez à des opportunités uniques dans la construction</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-6 rounded-xl">
            <Users2 className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Communauté Active</h3>
            <p className="text-muted-foreground">Échangez avec d'autres professionnels du secteur</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-6 rounded-xl">
            <Briefcase className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gestion de Carrière</h3>
            <p className="text-muted-foreground">Outils complets pour gérer votre progression professionnelle</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-6 rounded-xl">
            <Rocket className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Innovation Continue</h3>
            <p className="text-muted-foreground">Restez à la pointe des nouvelles opportunités du secteur</p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 rounded-xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 font-playfair">Prêt à Transformer Votre Carrière?</h3>
            <p className="text-muted-foreground mb-6 font-montserrat">
              Rejoignez des milliers de professionnels qui font confiance à Victaure pour leur développement professionnel
            </p>
            <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-3 rounded-full transition-colors font-semibold">
              Commencer Maintenant
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
