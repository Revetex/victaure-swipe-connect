import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
        <div className="prose dark:prose-invert max-w-none">
          <h2>1. Collecte d'informations</h2>
          <p>
            Nous collectons des informations lorsque vous vous inscrivez sur notre site, vous connectez à votre compte, effectuez un achat ou remplissez un formulaire.
          </p>

          <h2>2. Utilisation des informations</h2>
          <p>
            Les informations que nous collectons peuvent être utilisées pour :
          </p>
          <ul>
            <li>Personnaliser votre expérience</li>
            <li>Améliorer notre site web</li>
            <li>Améliorer le service client</li>
            <li>Vous contacter par email</li>
            <li>Administrer un concours, une promotion ou une enquête</li>
          </ul>

          <h2>3. Protection des informations</h2>
          <p>
            Nous mettons en œuvre diverses mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne.
          </p>

          <h2>4. Divulgation à des tiers</h2>
          <p>
            Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers. Cela ne comprend pas les tierces parties de confiance qui nous aident à exploiter notre site web ou à mener nos affaires, tant que ces parties conviennent de garder ces informations confidentielles.
          </p>

          <h2>5. Consentement</h2>
          <p>
            En utilisant notre site, vous consentez à notre politique de confidentialité.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}