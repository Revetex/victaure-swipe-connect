
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  
  const themes = [
    { name: "Clair", value: "light", icon: Sun },
    { name: "Sombre", value: "dark", icon: Moon },
    { name: "Système", value: "system", icon: Monitor }
  ];

  return (
    <div className="flex flex-wrap gap-2 p-1">
      {themes.map(item => (
        <Button
          key={item.value}
          variant="ghost"
          size="sm"
          onClick={() => {
            setTheme(item.value);
            toast.success(`Thème ${item.name.toLowerCase()} activé`);
          }}
          className={cn(
            "flex-1 font-normal hover-scale",
            theme === item.value ? "bg-primary/10 text-primary" : "bg-white/5"
          )}
        >
          <item.icon className="h-4 w-4 mr-2" />
          <span className="text-sm">{item.name}</span>
        </Button>
      ))}
    </div>
  );
}

// Import cn utility
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
