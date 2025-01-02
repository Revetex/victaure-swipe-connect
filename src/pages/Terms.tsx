import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Conditions d'utilisation</h1>
        <div className="prose dark:prose-invert max-w-none">
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.
          </p>

          <h2>2. Utilisation de la licence</h2>
          <p>
            La permission est accordée de télécharger temporairement une copie des documents (informations ou logiciels) sur le site Web de Victaure pour un visionnement transitoire personnel et non commercial uniquement.
          </p>

          <h2>3. Clause de non-responsabilité</h2>
          <p>
            Les documents sur le site Web de Victaure sont fournis "tels quels". Victaure ne donne aucune garantie, expresse ou implicite, et décline et annule par la présente toutes les autres garanties.
          </p>

          <h2>4. Limitations</h2>
          <p>
            Victaure ou ses fournisseurs ne seront en aucun cas tenus responsables des dommages spéciaux, accessoires, indirects ou consécutifs.
          </p>

          <h2>5. Révisions et errata</h2>
          <p>
            Les documents sur le site Web de Victaure peuvent inclure des erreurs techniques, typographiques ou photographiques. Victaure ne garantit pas que l'un des documents est exact, complet ou à jour.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}