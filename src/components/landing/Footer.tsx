import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="w-full py-12 bg-background/80 backdrop-blur-sm border-t">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Notre Mission</h3>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-sm text-muted-foreground"
            >
              <p>
                Chez Victaure, notre mission est de révolutionner le recrutement grâce à l'intelligence artificielle. 
                Nous créons des connexions significatives entre les talents et les opportunités, 
                en utilisant des technologies de pointe pour un matching précis et personnalisé.
              </p>
            </motion.div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Légal</h3>
            <ul className="space-y-2 text-sm">
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

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Support</h3>
            <ul className="space-y-2 text-sm">
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

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Suivez-nous</h3>
            <ul className="space-y-2 text-sm">
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

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Victaure. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}