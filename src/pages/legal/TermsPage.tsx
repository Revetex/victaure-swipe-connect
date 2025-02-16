import { PageLayout } from "@/components/layout/PageLayout";

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Conditions d'utilisation</h1>
        <div className="prose dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant ce site, vous acceptez d'être lié par ces conditions 
              d'utilisation, toutes les lois et réglementations applicables, et acceptez que 
              vous êtes responsable du respect des lois locales applicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Utilisation de la licence</h2>
            <p>
              La permission est accordée de télécharger temporairement une copie des documents 
              pour un affichage personnel et non commercial transitoire uniquement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Clause de non-responsabilité</h2>
            <p>
              Les documents sur ce site sont fournis "tels quels". Nous ne donnons aucune 
              garantie, expresse ou implicite, et déclinons par la présente toute garantie.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Limitations</h2>
            <p>
              En aucun cas, nous ou nos fournisseurs ne seront responsables des dommages 
              découlant de l'utilisation ou de l'impossibilité d'utiliser les documents 
              sur ce site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Révisions et errata</h2>
            <p>
              Les documents sur ce site peuvent inclure des erreurs techniques, 
              typographiques ou photographiques. Nous nous réservons le droit de 
              modifier ou de mettre à jour ces conditions à tout moment.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
