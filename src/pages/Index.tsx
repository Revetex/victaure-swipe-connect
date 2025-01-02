import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Navigation } from "@/components/Navigation";

export default function Index() {
  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      <Navigation />
      <main className="container mx-auto">
        <Hero />
        <Features />
        <Stats />
      </main>
    </div>
  );
}