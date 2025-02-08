
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "Clair", value: "light", icon: Sun },
    { name: "Sombre", value: "dark", icon: Moon },
    { name: "Système", value: "system", icon: Monitor },
  ];

  return (
    <div className="space-y-1">
      {themes.map((item) => (
        <Button
          key={item.value}
          variant="ghost"
          size="sm"
          className={`w-full justify-start gap-2 px-2 h-9 ${theme === item.value ? 'bg-accent' : ''}`}
          onClick={() => {
            setTheme(item.value);
            toast.success(`Thème ${item.name.toLowerCase()} activé`);
          }}
        >
          <item.icon className="h-4 w-4" />
          <span className="text-sm">{item.name}</span>
        </Button>
      ))}
    </div>
  );
}
