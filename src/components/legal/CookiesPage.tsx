
import { motion } from "framer-motion";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#1B2A4A] py-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-[#F2EBE4] mb-8">Politique des Cookies</h1>
        
        <div className="space-y-8 text-[#F2EBE4]/80">
          <section className="legal-section">
            <h2 className="text-xl font-semibold mb-4 text-[#F2EBE4]">Qu'est-ce qu'un cookie ?</h2>
            <p className="mb-4">
              Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies sont largement utilisés pour faire fonctionner les sites web ou les rendre plus efficaces, ainsi que pour fournir des informations aux propriétaires du site.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="text-xl font-semibold mb-4 text-[#F2EBE4]">Comment utilisons-nous les cookies ?</h2>
            <p className="mb-4">
              Nous utilisons différents types de cookies pour :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Assurer le bon fonctionnement de notre plateforme</li>
              <li>Mémoriser vos préférences et paramètres</li>
              <li>Améliorer la sécurité de votre connexion</li>
              <li>Analyser l'utilisation de notre site</li>
              <li>Personnaliser votre expérience utilisateur</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="text-xl font-semibold mb-4 text-[#F2EBE4]">Types de cookies utilisés</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#F2EBE4]">Cookies essentiels</h3>
                <p>Nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#F2EBE4]">Cookies de performance</h3>
                <p>Nous aident à comprendre comment les visiteurs interagissent avec notre site.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#F2EBE4]">Cookies de fonctionnalité</h3>
                <p>Permettent de mémoriser vos choix et préférences.</p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2 className="text-xl font-semibold mb-4 text-[#F2EBE4]">Gestion des cookies</h2>
            <p className="mb-4">
              Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez supprimer tous les cookies déjà présents sur votre ordinateur et paramétrer la plupart des navigateurs pour qu'ils les bloquent. Toutefois, dans ce cas, vous devrez peut-être paramétrer manuellement certaines préférences chaque fois que vous visiterez notre site.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="text-xl font-semibold mb-4 text-[#F2EBE4]">Nous contacter</h2>
            <p>
              Pour toute question concernant notre politique de cookies, vous pouvez nous contacter à :
            </p>
            <div className="mt-4">
              <p>Email : tblanchet3909@hotmail.com</p>
              <p>Téléphone : 819 668-0473</p>
              <p>Adresse : Trois-Rivières, Québec, Canada</p>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
