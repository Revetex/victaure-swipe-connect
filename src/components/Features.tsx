import { Check, Briefcase, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Briefcase,
    title: "Matching Intelligent",
    description:
      "Trouvez les missions qui correspondent parfaitement à vos compétences grâce à notre IA.",
  },
  {
    icon: Calendar,
    title: "Gestion Simplifiée",
    description:
      "Gérez vos contrats et paiements en toute simplicité avec notre plateforme automatisée.",
  },
  {
    icon: Check,
    title: "Certifications Blockchain",
    description:
      "Validez vos compétences avec des certifications sécurisées et reconnues.",
  },
  {
    icon: DollarSign,
    title: "Services Financiers",
    description:
      "Accédez à des services financiers et assuranciels intégrés pour sécuriser vos missions.",
  },
];

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
    <section className="py-16">
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-dark-purple/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9b87f5]/10 dark:border-[#D6BCFA]/10"
            >
              <div className="w-16 h-16 bg-[#9b87f5]/10 dark:bg-[#D6BCFA]/10 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-[#9b87f5] dark:text-[#D6BCFA]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}