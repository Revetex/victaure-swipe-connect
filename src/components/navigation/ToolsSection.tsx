
import { ListTodo, Calculator, Languages, Sword, ChevronDown, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const toolItems = [
  { 
    icon: ListTodo, 
    label: 'Notes & Tâches', 
    to: '/dashboard/tools'
  },
  { 
    icon: Calculator, 
    label: 'Calculatrice', 
    to: '/dashboard/tools?tool=calculator'
  },
  { 
    icon: Languages, 
    label: 'Traducteur', 
    to: '/dashboard/tools?tool=translator'
  },
  { 
    icon: Sword, 
    label: 'Échecs', 
    to: '/dashboard/tools?tool=chess'
  },
];

interface ToolsSectionProps {
  openTools: boolean;
  setOpenTools: (open: boolean) => void;
}

export function ToolsSection({ openTools, setOpenTools }: ToolsSectionProps) {
  return (
    <Collapsible
      open={openTools}
      onOpenChange={setOpenTools}
      className="space-y-2"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 rounded-lg transition-colors hover:bg-accent/50">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">Outils</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            openTools && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        {toolItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-accent/50 ml-4"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{item.label}</span>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
