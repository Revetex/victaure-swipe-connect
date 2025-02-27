
import { motion } from "framer-motion";

interface CountdownProps {
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export function CountdownSection({ countdown }: CountdownProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative w-full py-8 space-y-8"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-center mb-8 text-[#F2EBE4]"
      >
        <span className="bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] bg-clip-text text-transparent">
          Lancement officiel 
        </span> dans
      </motion.h2>
      
      <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-3xl mx-auto">
        {[
          { value: countdown.days, label: "Jours" },
          { value: countdown.hours, label: "Heures" },
          { value: countdown.minutes, label: "Minutes" },
          { value: countdown.seconds, label: "Secondes" }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#D3E4FD]/10 to-transparent backdrop-blur-lg border border-[#D3E4FD]/20 rounded-lg sm:rounded-xl p-3 sm:p-5 flex flex-col items-center justify-center"
          >
            <span className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] bg-clip-text text-transparent">
              {item.value}
            </span>
            <span className="text-[#F2EBE4]/70 text-xs sm:text-sm mt-1 sm:mt-2">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <button className="bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] hover:from-[#D3E4FD] hover:to-[#64B5D9] text-[#1A1F2C] font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
          Préinscrivez-vous maintenant
        </button>
      </motion.div>
    </motion.section>
  );
}
