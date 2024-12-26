import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, X, Briefcase } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobTitles } from "@/data/jobTitles";

interface VCardHeaderProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function VCardHeader({ profile, isEditing, setProfile, setIsEditing }: VCardHeaderProps) {
  return (
    <div className="flex flex-row items-start justify-between">
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">
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
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          {isEditing ? (
            <Select
              value={profile.title}
              onValueChange={(value) => setProfile({ ...profile, title: value })}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Sélectionnez un titre" />
              </SelectTrigger>
              <SelectContent>
                {jobTitles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span>{profile.title}</span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditing(!isEditing)}
        className="text-muted-foreground hover:text-foreground"
      >
        {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}