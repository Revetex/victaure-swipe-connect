import { Messages } from "@/components/Messages";
import { motion } from "framer-motion";

interface MessagesSectionProps {
  variants: any;
}

export function MessagesSection({ variants }: MessagesSectionProps) {
  return (
    <motion.div 
      variants={variants}
      className="col-span-1 md:col-span-1 xl:col-span-1 h-[650px] md:h-[750px]"
    >
      <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
        <div className="p-6 sm:p-8 h-full">
          <Messages />
        </div>
      </div>
    </motion.div>
  );
}