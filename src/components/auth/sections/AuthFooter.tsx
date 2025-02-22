
import { Link } from "react-router-dom";

export function AuthFooter() {
  return (
    <footer className="mt-24 w-full max-w-xl mx-auto px-4 text-center">
      <div className="space-y-8 border-t border-[#F2EBE4]/10 pt-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#F2EBE4]">Liens juridiques</h3>
          <div className="space-y-2">
            <Link 
              to="/legal/terms" 
              className="block text-sm text-[#F2EBE4]/80 hover:text-[#64B5D9] transition-colors"
            >
              Conditions d'utilisation
            </Link>
            <Link 
              to="/legal/privacy" 
              className="block text-sm text-[#F2EBE4]/80 hover:text-[#64B5D9] transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link 
              to="/legal/cookies" 
              className="block text-sm text-[#F2EBE4]/80 hover:text-[#64B5D9] transition-colors"
            >
              Politique des cookies
            </Link>
          </div>
        </div>

        <div className="text-sm text-[#F2EBE4]/60">
          <p>© {new Date().getFullYear()} Victaure Technologies inc.</p>
        </div>
      </div>
    </footer>
  );
}
