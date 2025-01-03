export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>
        <h2>1. Introduction</h2>
        <p>
          Bienvenue sur la politique de confidentialité de Victaure. Nous nous engageons à protéger vos données personnelles et à être transparents sur leur utilisation.
        </p>
        {/* Add more content as needed */}
      </div>
    </div>
  );
}