import { Navigation } from "@/components/Navigation";
import { SwipeMatch } from "@/components/SwipeMatch";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-roboto">
      <Navigation />
      <main className="container mx-auto px-4">
        <Hero />
        <Features />
        <section className="py-16 bg-white rounded-lg shadow-sm my-8">
          <div className="max-w-4xl mx-auto">
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