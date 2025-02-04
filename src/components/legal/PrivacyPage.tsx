import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PrivacyPage() {
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
          <CardTitle>Politique de confidentialité</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Collecte des données</h2>
          <p>
            Nous collectons les informations suivantes :
          </p>
          <ul>
            <li>Informations d'identification (nom, prénom, email)</li>
            <li>Informations professionnelles (CV, expériences, compétences)</li>
            <li>Données de connexion et d'utilisation</li>
            <li>Informations de géolocalisation (si autorisé)</li>
          </ul>

          <h2>2. Utilisation des données</h2>
          <p>
            Vos données sont utilisées pour :
          </p>
          <ul>
            <li>Fournir et améliorer nos services</li>
            <li>Personnaliser votre expérience</li>
            <li>Communiquer avec vous</li>
            <li>Faciliter les mises en relation professionnelles</li>
          </ul>

          <h2>3. Protection des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, modification, divulgation ou destruction non autorisée.
          </p>

          <h2>4. Partage des données</h2>
          <p>
            Nous ne partageons vos données qu'avec :
          </p>
          <ul>
            <li>Les utilisateurs autorisés dans le cadre de mises en relation</li>
            <li>Nos prestataires de services sous contrat</li>
            <li>Les autorités légales sur demande</li>
          </ul>

          <h2>5. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>

          <h2>6. Contact</h2>
          <p>
            Pour exercer vos droits ou pour toute question, contactez notre DPO : privacy@victaure.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}