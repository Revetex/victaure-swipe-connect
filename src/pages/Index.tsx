import { Navigation } from "@/components/Navigation";
import { SwipeMatch } from "@/components/SwipeMatch";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-roboto">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg text-victaure-gray-dark max-w-2xl mx-auto">
            Swipe right on your future. Victaure matches talented professionals with
            their perfect opportunities using smart AI technology.
          </p>
        </section>
        <SwipeMatch />
      </main>
    </div>
  );
};

export default Index;