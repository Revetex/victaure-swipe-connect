
import { Settings, Bell, Moon, Lock, EyeOff, LogOut, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const settingsItems = [
  {
    icon: Bell,
    label: 'Notifications',
    to: '/settings/notifications'
  },
  {
    icon: Moon,
    label: 'Apparence',
    to: '/settings/appearance'
  },
  {
    icon: Lock,
    label: 'Sécurité',
    to: '/settings/security'
  },
  {
    icon: EyeOff,
    label: 'Confidentialité',
    to: '/settings/privacy'
  },
  {
    icon: LogOut,
    label: 'Déconnexion',
    to: '/settings/logout'
  }
];

interface SettingsSectionProps {
  openSettings: boolean;
  setOpenSettings: (open: boolean) => void;
}

export function SettingsSection({ openSettings, setOpenSettings }: SettingsSectionProps) {
  return (
    <Collapsible
      open={openSettings}
      onOpenChange={setOpenSettings}
      className="space-y-2"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 rounded-lg transition-colors hover:bg-accent/50">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">Paramètres</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            openSettings && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        {settingsItems.map((item) => (
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
