import { Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-victaure-blue">
        <Settings2 className="h-5 w-5 animate-rotate" />
        <h2 className="text-lg font-semibold">Paramètres</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between space-x-4 hover:bg-victaure-dark/20 p-2 rounded-lg transition-colors">
          <Label className="text-sm cursor-pointer">Mode sombre</Label>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-4 hover:bg-victaure-dark/20 p-2 rounded-lg transition-colors">
          <Label className="text-sm cursor-pointer">Notifications</Label>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-4 hover:bg-victaure-dark/20 p-2 rounded-lg transition-colors">
          <Label className="text-sm cursor-pointer">Emails</Label>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
}