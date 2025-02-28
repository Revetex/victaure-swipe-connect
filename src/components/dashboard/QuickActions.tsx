
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonWithTooltip } from "@/components/ui/button-with-tooltip";
import { UserCog, FileText, UserPlus, Briefcase, Shield, Newspaper, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface QuickActionsProps {
  onRequestChat?: () => void;
}

export function QuickActions({ onRequestChat }: QuickActionsProps) {
  const navigate = useNavigate();

  const handleChatClick = () => {
    if (onRequestChat) {
      onRequestChat();
    } else {
      navigate("/chat");
    }
  };

  const actions = [
    {
      icon: UserCog,
      label: "Modifier profil",
      onClick: () => navigate("/settings"),
      tooltip: "Mettre à jour vos informations personnelles"
    },
    {
      icon: FileText,
      label: "Créer CV",
      onClick: () => navigate("/cv"),
      tooltip: "Créer ou mettre à jour votre CV"
    },
    {
      icon: UserPlus,
      label: "Connexions",
      onClick: () => navigate("/connections"),
      tooltip: "Gérer vos connexions professionnelles"
    },
    {
      icon: Briefcase,
      label: "Emplois",
      onClick: () => navigate("/jobs"),
      tooltip: "Parcourir les offres d'emploi"
    },
    {
      icon: MessageSquare,
      label: "Assistant",
      onClick: handleChatClick,
      tooltip: "Discuter avec l'assistant"
    },
    {
      icon: Newspaper,
      label: "Articles",
      onClick: () => navigate("/articles"),
      tooltip: "Lire les derniers articles professionnels"
    }
  ];

  return (
    <Card className="bg-background/30 backdrop-blur-md border-border/30 shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium tracking-normal">
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <ButtonWithTooltip
              key={index}
              variant="ghost"
              className="w-full text-xs h-auto flex flex-col items-center justify-center gap-2 p-3"
              onClick={action.onClick}
              tooltip={action.tooltip}
            >
              <action.icon className="h-5 w-5 text-foreground/80" />
              <span className="text-foreground/70">{action.label}</span>
            </ButtonWithTooltip>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
