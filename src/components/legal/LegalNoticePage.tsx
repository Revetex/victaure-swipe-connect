import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LegalNoticePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-6 top-6 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/')}
      >
        <X className="h-6 w-6" />
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Mentions légales</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Éditeur du site</h2>
          <p>
            Victaure Inc.<br />
            3141 Chemin Langevin<br />
            Trois-Rivières, QC G8W 2L8<br />
            Canada<br />
            contact@victaure.com
          </p>

          <h2>2. Directeur de la publication</h2>
          <p>
            Thomas Blanchet<br />
            Président Directeur Général
          </p>

          <h2>3. Hébergement</h2>
          <p>
            Le site est hébergé par :<br />
            Vercel Inc.<br />
            340 S Lemon Ave #4133<br />
            Walnut, CA 91789<br />
            États-Unis
          </p>

          <h2>4. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu du site (textes, images, vidéos, etc.) est protégé par le droit d'auteur. Toute reproduction ou représentation, totale ou partielle, est interdite sans autorisation préalable.
          </p>

          <h2>5. Protection des données</h2>
          <p>
            Conformément à la loi sur la protection des renseignements personnels, vous disposez d'un droit d'accès, de modification et de suppression de vos données personnelles.
          </p>

          <h2>6. Loi applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit canadien. En cas de litige, les tribunaux canadiens seront seuls compétents.
          </p>

          <h2>7. Contact</h2>
          <p>
            Pour toute question concernant ces mentions légales : legal@victaure.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}