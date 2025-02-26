
export function AuthFooter() {
  return (
    <footer className="mt-8 w-full max-w-xl mx-auto">
      <div className="space-y-4 border-t border-[#F1F0FB]/20 pt-4">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/white-signature.png" 
            alt="Signature décorative" 
            className="w-24 h-10 object-contain opacity-50 hover:opacity-70 transition-opacity"
          />
        </div>

        <AuthFooterLinks />

        <div className="relative text-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[#64B5D9]/5 to-transparent opacity-50" />
          <p className="relative font-extralight text-xs text-[#F1F0FB]/80">
            © 2025 Victaure Technologies inc.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { AuthFooterLinks } from "./footer/AuthFooterLinks";
