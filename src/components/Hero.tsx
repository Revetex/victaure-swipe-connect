import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Hero() {
  return (
    <section className="py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-cyber-pattern opacity-10" />
      <div className="relative z-10">
        <div className="inline-block animate-glow mb-6">
          <div className="flex flex-col items-center gap-6 mb-8">
            <Logo size="lg" className="mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-victaure-blue-light mb-2">
              Transformez votre carrière avec{" "}
              <span className="text-victaure-orange-light">Victaure</span>
            </h1>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-victaure-blue to-victaure-orange mx-auto rounded-full" />
        </div>
        <p className="text-lg text-victaure-gray max-w-2xl mx-auto mb-8">
          Une plateforme innovante qui connecte les talents aux meilleures opportunités
          grâce à l'intelligence artificielle.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-victaure-blue hover:bg-victaure-blue-dark text-white relative overflow-hidden group"
          >
            <span className="relative z-10">Commencer maintenant</span>
            <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
            <span className="absolute inset-0 bg-gradient-radial from-victaure-blue-light to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-victaure-blue text-victaure-blue hover:bg-victaure-blue/10 relative overflow-hidden group"
          >
            <span className="relative z-10">Pour les employeurs</span>
            <span className="absolute inset-0 bg-gradient-radial from-victaure-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </div>
    </section>
  );
}