import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function VCardEmpty() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <UserPlus className="h-12 w-12 text-gray-400" />
      <h3 className="text-lg font-medium">No Profile Found</h3>
      <p className="text-sm text-gray-500">Create your professional profile to get started.</p>
      <Button>Create Profile</Button>
    </div>
  );
}