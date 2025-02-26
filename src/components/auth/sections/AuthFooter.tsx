import { AuthFooterActions } from "./footer/AuthFooterActions";
import { AuthFooterLinks } from "./footer/AuthFooterLinks";
export function AuthFooter() {
  return <footer role="contentinfo" className="mt-24 w-full max-w-xl mx-auto text-center relative my-0 px-0">
      <div className="space-y-8 border-t border-[#F1F0FB]/20 pt-8 py-0">
        <AuthFooterActions />

        <div className="flex justify-center">
          <img src="/lovable-uploads/white-signature.png" alt="Signature décorative" className="w-40 h-16 object-contain opacity-50" />
        </div>

        <AuthFooterLinks />

        <div className="text-sm text-[#F1F0FB]/80 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#64B5D9]/5 to-transparent opacity-50"></div>
          <p className="relative font-extralight text-xs">© 2025 Victaure Technologies inc.</p>
        </div>
      </div>
    </footer>;
}