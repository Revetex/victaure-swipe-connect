import { Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function Settings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-victaure-blue">
        <Settings2 className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Paramètres</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm">Mode sombre</label>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm">Notifications</label>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm">Emails</label>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
}