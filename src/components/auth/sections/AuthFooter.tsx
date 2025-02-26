
import { AuthFooterActions } from "./footer/AuthFooterActions";
import { AuthFooterLinks } from "./footer/AuthFooterLinks";

export function AuthFooter() {
  return (
    <footer className="mt-24 w-full max-w-xl mx-auto px-4 text-center relative" role="contentinfo">
      <div className="space-y-8 border-t border-[#3C3C3C]/10 pt-8">
        <AuthFooterActions />

        <div className="flex justify-center mb-12">
          <img 
            src="/lovable-uploads/white-signature.png" 
            alt="Signature décorative" 
            className="w-40 h-16 object-contain opacity-30" 
          />
        </div>

        <AuthFooterLinks />

        <div className="text-sm text-[#E0E0E0]/60 relative pb-8">
          <div className="absolute inset-0 bg-gradient-to-t from-[#64B5D9]/5 to-transparent opacity-30"></div>
          <p className="relative">© 2025 Victaure Technologies inc.</p>
        </div>
      </div>
    </footer>
  );
}
