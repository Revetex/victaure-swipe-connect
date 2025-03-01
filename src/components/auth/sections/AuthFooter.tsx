
import { motion } from "framer-motion";
import { AuthFooterLinks } from "./footer/AuthFooterLinks";
import { useThemeContext } from "@/components/ThemeProvider";

export function AuthFooter() {
  const { themeStyle } = useThemeContext();
  
  return (
    <footer className={`w-full py-6 border-t border-[#F1F0FB]/10 bg-[#1A1F2C]/60 backdrop-blur-sm z-10 theme-${themeStyle}`}>
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/white-signature.png" 
                alt="Signature décorative" 
                className="w-24 h-10 object-contain opacity-50 hover:opacity-70 transition-opacity"
              />
            </div>

            <AuthFooterLinks />
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#64B5D9]/5 to-transparent opacity-50"></div>
            <p className="relative font-extralight text-xs text-[#F1F0FB]/60">
              © {new Date().getFullYear()} Victaure Technologies inc.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
