import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export function AppearanceSection() {
  const {
    theme,
    setTheme
  } = useTheme();
  const themes = [{
    name: "Clair",
    value: "light",
    icon: Sun
  }, {
    name: "Sombre",
    value: "dark",
    icon: Moon
  }, {
    name: "Système",
    value: "system",
    icon: Monitor
  }];
  return <div className="space-y-1 rounded-none bg-black">
      {themes.map(item => <Button key={item.value} variant="ghost" size="sm" onClick={() => {
      setTheme(item.value);
      toast.success(`Thème ${item.name.toLowerCase()} activé`);
    }} className="mx-[6px] font-normal rounded-none">
          <item.icon className="h-4 w-4" />
          <span className="text-sm">{item.name}</span>
        </Button>)}
    </div>;
}