import { Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-primary">
        <Settings2 className="h-5 w-5 animate-rotate" />
        <h2 className="text-lg font-semibold">Paramètres</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between space-x-4 hover:bg-muted p-2 rounded-lg transition-colors">
          <Label className="text-sm cursor-pointer">Mode sombre</Label>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
        <div className="flex items-center justify-between space-x-4 hover:bg-muted p-2 rounded-lg transition-colors">
          <Label className="text-sm cursor-pointer">Notifications</Label>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-4 hover:bg-muted p-2 rounded-lg transition-colors">
          <Label className="text-sm cursor-pointer">Emails</Label>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
}