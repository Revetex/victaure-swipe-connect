import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function CTASection() {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-background dark:bg-background">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Prêt à Booster Votre Carrière ?
        </h2>
        <p className="text-muted-foreground mb-8">
          Rejoignez Victaure aujourd'hui et accédez à des opportunités professionnelles uniques.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/auth?mode=signup")}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] dark:bg-[#D6BCFA] dark:hover:bg-[#7E69AB] text-white px-8"
        >
          Créer Mon Compte
        </Button>
      </div>
    </section>
  );
}