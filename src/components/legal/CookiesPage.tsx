import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CookiesPage() {
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
          <CardTitle>Politique des cookies</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte stocké sur votre appareil lors de la visite d'un site web. Les cookies nous permettent de reconnaître votre appareil et d'améliorer votre expérience utilisateur.
          </p>

          <h2>2. Types de cookies utilisés</h2>
          <h3>Cookies essentiels</h3>
          <p>
            Nécessaires au fonctionnement du site, ils permettent :
          </p>
          <ul>
            <li>La connexion sécurisée à votre compte</li>
            <li>La mémorisation de vos préférences</li>
            <li>Le bon fonctionnement technique du site</li>
          </ul>

          <h3>Cookies analytiques</h3>
          <p>
            Nous utilisons ces cookies pour :
          </p>
          <ul>
            <li>Analyser le trafic du site</li>
            <li>Comprendre comment vous utilisez nos services</li>
            <li>Améliorer nos fonctionnalités</li>
          </ul>

          <h3>Cookies de personnalisation</h3>
          <p>
            Ces cookies nous permettent de :
          </p>
          <ul>
            <li>Mémoriser vos préférences</li>
            <li>Adapter le contenu à vos intérêts</li>
            <li>Améliorer votre expérience utilisateur</li>
          </ul>

          <h2>3. Gestion des cookies</h2>
          <p>
            Vous pouvez à tout moment :
          </p>
          <ul>
            <li>Accepter ou refuser les cookies non essentiels</li>
            <li>Modifier vos préférences dans les paramètres de votre navigateur</li>
            <li>Supprimer les cookies existants</li>
          </ul>

          <h2>4. Contact</h2>
          <p>
            Pour toute question concernant notre utilisation des cookies : cookies@victaure.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}