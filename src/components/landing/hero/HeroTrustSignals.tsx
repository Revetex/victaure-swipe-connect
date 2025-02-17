
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function HeroTrustSignals() {
  return (
    <section 
      className="py-24"
      aria-labelledby="trust-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="text-center md:text-left mb-12">
              <motion.h2 
                id="trust-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent"
              >
                Ils nous font confiance
              </motion.h2>
            </div>
            
            <div className="space-y-6">
              {[
                "Processus de recrutement simplifié et efficace",
                "Support réactif et professionnel disponible 24/7",
                "Matching précis entre candidats et emplois",
                "Protection des données garantie selon les normes RGPD"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 
                    className="h-6 w-6 text-purple-500 shrink-0" 
                    aria-hidden="true"
                  />
                  <span className="text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              controls
              id="trustVideo"
              className="w-full h-full object-cover rounded-xl"
              aria-label="Vidéo de présentation Victaure"
              onClick={(e) => {
                const video = e.currentTarget;
                if (video.paused) {
                  video.play();
                } else {
                  video.pause();
                }
              }}
            >
              <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
