import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Transformez votre carrière avec{" "}
        <span className="text-victaure-blue">Victaure</span>
      </h1>
      <p className="text-lg text-victaure-gray-dark max-w-2xl mx-auto mb-8">
        Une plateforme innovante qui connecte les talents aux meilleures opportunités
        grâce à l'intelligence artificielle.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          className="bg-victaure-blue hover:bg-blue-600 text-white"
        >
          Commencer maintenant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-victaure-blue text-victaure-blue hover:bg-victaure-blue/10"
        >
          Pour les employeurs
        </Button>
      </div>
    </section>
  );
}