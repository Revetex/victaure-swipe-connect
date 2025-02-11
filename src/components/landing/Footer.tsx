
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full py-8 md:py-16 bg-primary/5 backdrop-blur-sm border-t border-primary/10">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-playfair text-lg md:text-xl font-semibold text-primary/90">Légal</h3>
            <ul className="space-y-2 md:space-y-3 text-sm font-montserrat">
              <li>
                <Link to="/legal/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/legal/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  Politique des cookies
                </Link>
              </li>
              <li>
                <Link to="/legal/mentions" className="text-muted-foreground hover:text-primary transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-playfair text-lg md:text-xl font-semibold text-primary/90">Support</h3>
            <ul className="space-y-2 md:space-y-3 text-sm font-montserrat">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-playfair text-lg md:text-xl font-semibold text-primary/90">Suivez-nous</h3>
            <ul className="space-y-2 md:space-y-3 text-sm font-montserrat">
              <li>
                <a 
                  href="https://linkedin.com/company/victaure" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com/victaure" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-4 md:pt-6 border-t border-primary/10 text-center">
          <p className="text-xs md:text-sm text-muted-foreground font-montserrat">
            © {new Date().getFullYear()} Victaure. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
