
import { motion } from "framer-motion";
import { Languages } from "lucide-react";

interface TranslatorLayoutProps {
  children: React.ReactNode;
}

export function TranslatorLayout({ children }: TranslatorLayoutProps) {
  return (
    <div className="container mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-6">
          <Languages className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Translator</h1>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

