import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Container } from "@/components/ui/container";

export default function Index() {
  return (
    <Container size="lg" className="space-y-16 pb-16">
      <Hero />
      <Features />
      <Stats />
    </Container>
  );
}