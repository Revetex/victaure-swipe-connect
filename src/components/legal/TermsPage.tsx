
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-12"
    >
      <section className="legal-section">
        <h1 className="legal-title mb-8 text-3xl font-bold">Conditions d'utilisation</h1>
        <div className="legal-content space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptation des Conditions</h2>
            <p className="mb-4">En utilisant notre plateforme, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Utilisation du Service</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vous devez avoir l'âge légal pour utiliser nos services.</li>
              <li>Vous êtes responsable de maintenir la confidentialité de votre compte.</li>
              <li>Vous acceptez de ne pas utiliser le service à des fins illégales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Protection des Données</h2>
            <p className="mb-4">Nous nous engageons à protéger vos données personnelles conformément à la législation en vigueur :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Collecte limitée aux informations nécessaires</li>
              <li>Stockage sécurisé des données</li>
              <li>Non-divulgation à des tiers sans consentement</li>
              <li>Droit d'accès et de rectification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Propriété Intellectuelle</h2>
            <p className="mb-4">Tous les contenus présents sur la plateforme sont protégés par le droit d'auteur :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Interdiction de reproduction sans autorisation</li>
              <li>Respect des marques déposées</li>
              <li>Protection des créations originales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Responsabilités</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nous nous efforçons de maintenir le service disponible et sécurisé</li>
              <li>Nous ne sommes pas responsables des contenus générés par les utilisateurs</li>
              <li>Les utilisateurs sont responsables de leurs actions sur la plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Modifications</h2>
            <p>Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives dès leur publication.</p>
          </section>
        </div>
      </section>
    </motion.div>
  );
}
