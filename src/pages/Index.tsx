
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Bienvenue sur Victaure</h1>
      <div className="flex flex-col gap-4 md:flex-row">
        <Link to="/jobs">
          <Button size="lg">
            Voir les offres d'emploi
          </Button>
        </Link>
        <Link to="/auth">
          <Button variant="outline" size="lg">
            Se connecter
          </Button>
        </Link>
      </div>
    </div>
  );
}
