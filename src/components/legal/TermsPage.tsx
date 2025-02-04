import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TermsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <CardTitle>Conditions d'utilisation</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables, et acceptez que vous êtes responsable du respect des lois locales applicables.
          </p>

          <h2>2. Licence d'utilisation</h2>
          <p>
            La permission d'utiliser temporairement ce site est accordée sur une base limitée, sous réserve des restrictions suivantes :
          </p>
          <ul>
            <li>Ne pas republier le contenu</li>
            <li>Ne pas vendre, louer ou sous-licencier le contenu</li>
            <li>Ne pas reproduire, dupliquer ou copier le contenu</li>
            <li>Ne pas exploiter le contenu à des fins commerciales</li>
          </ul>

          <h2>3. Compte utilisateur</h2>
          <p>
            Pour accéder à certaines fonctionnalités du site, vous devrez créer un compte. Vous êtes responsable de :
          </p>
          <ul>
            <li>Maintenir la confidentialité de votre compte</li>
            <li>Restreindre l'accès à votre ordinateur et/ou compte</li>
            <li>Assumer la responsabilité de toutes les activités sous votre compte</li>
          </ul>

          <h2>4. Services de mise en relation</h2>
          <p>
            Notre plateforme facilite la mise en relation entre professionnels et employeurs. Nous ne sommes pas responsables :
          </p>
          <ul>
            <li>De la qualité des services fournis</li>
            <li>Des accords conclus entre les parties</li>
            <li>Des litiges entre utilisateurs</li>
          </ul>

          <h2>5. Limitation de responsabilité</h2>
          <p>
            Victaure ne sera pas tenu responsable des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser nos services.
          </p>

          <h2>6. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prennent effet immédiatement après leur publication sur le site.
          </p>

          <h2>7. Contact</h2>
          <p>
            Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à : contact@victaure.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}