import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full py-6 bg-background/80 backdrop-blur-sm border-t">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-semibold">À propos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Notre mission
                </Link>
              </li>
              <li>
                <p>
                  Siège social:<br />
                  1300 Rue Notre Dame Centre<br />
                  Trois-Rivières, QC G9A 4X3
                </p>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Légal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/legal/terms" className="hover:text-primary transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/legal/cookies" className="hover:text-primary transition-colors">
                  Politique des cookies
                </Link>
              </li>
              <li>
                <Link to="/legal/mentions" className="hover:text-primary transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Suivez-nous</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://linkedin.com/company/victaure" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://twitter.com/victaure" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Victaure. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}