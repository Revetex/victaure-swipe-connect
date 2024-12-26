import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, X } from "lucide-react";
import { Select } from "@/components/ui/select";
import { jobTitles } from "@/data/jobTitles";

interface VCardHeaderProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function VCardHeader({ profile, isEditing, setProfile, setIsEditing }: VCardHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <div className="text-2xl font-bold">
          {isEditing ? (
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="text-2xl font-bold"
            />
          ) : (
            profile.name
          )}
        </div>
        <div className="text-victaure-gray-dark">
          {isEditing ? (
            <Select
              value={profile.title}
              onValueChange={(value) => setProfile({ ...profile, title: value })}
            >
              {jobTitles.map((title) => (
                <Select.Option key={title} value={title}>
                  {title}
                </Select.Option>
              ))}
            </Select>
          ) : (
            profile.title
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}