import { Mail } from "lucide-react";
import { VCardSection } from "@/components/VCardSection";
import { motion } from "framer-motion";
import { CircuitBackground } from "./CircuitBackground";
import { ReactNode } from "react";

interface ContactSectionProps {
  children: ReactNode;
}

export function ContactSection({ children }: ContactSectionProps) {
  return (
    <VCardSection
      title="Contact"
      icon={<Mail className="h-3 w-3 text-muted-foreground" />}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative p-6 backdrop-blur-sm rounded-xl overflow-hidden"
      >
        <CircuitBackground />
        <div className="relative z-10 space-y-4">
          {children}
        </div>
      </motion.div>
    </VCardSection>
  );
}