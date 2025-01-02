import { Navigation } from "@/components/Navigation";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Bienvenue sur Victaure</h1>
        <p>Trouvez les meilleures opportunités professionnelles.</p>
      </main>
    </div>
  );
}