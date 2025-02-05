import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Processus de recrutement simplifié",
  "Support réactif et professionnel",
  "Matching précis entre candidats et emplois",
  "Protection des données garantie"
];

export function HeroFeatures() {
  return (
    <div className="space-y-6">
      {features.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3"
        >
          <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
          <span className="text-base sm:text-lg">{item}</span>
        </motion.div>
      ))}
    </div>
  );
}