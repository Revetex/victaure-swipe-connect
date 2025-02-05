import { motion } from "framer-motion";

export function HeroVideo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative rounded-xl overflow-hidden shadow-xl"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover rounded-xl"
      >
        <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </motion.div>
  );
}