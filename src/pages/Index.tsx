import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { SwipeMatch } from "@/components/SwipeMatch";
import { Stats } from "@/components/Stats";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Stats />
        <Dashboard />
        <Features />
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Trouvez votre prochaine opportunité
            </h2>
            <SwipeMatch />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;