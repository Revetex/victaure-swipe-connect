export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Conditions d'Utilisation</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>
        <h2>1. Acceptation des Conditions</h2>
        <p>
          En utilisant Victaure, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
        </p>
        {/* Add more content as needed */}
      </div>
    </div>
  );
}