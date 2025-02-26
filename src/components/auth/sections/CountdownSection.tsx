
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full space-y-6"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#F2EBE4]">
        Lancement officiel dans
      </h2>
      
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {[
          { value: countdown.days, label: "Jours" },
          { value: countdown.hours, label: "Heures" },
          { value: countdown.minutes, label: "Minutes" },
          { value: countdown.seconds, label: "Secondes" }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-gradient-to-br from-[#D3E4FD]/10 to-transparent backdrop-blur-lg border border-[#D3E4FD]/20 rounded-lg sm:rounded-xl p-2 sm:p-4 flex flex-col items-center justify-center"
          >
            <span className="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] bg-clip-text text-transparent">
              {item.value}
            </span>
            <span className="text-[#F2EBE4]/70 text-xs sm:text-sm mt-0.5 sm:mt-1">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
