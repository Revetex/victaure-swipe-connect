
import { UserProfile } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface SearchResultsProps {
  results: UserProfile[];
  onSelect?: (profile: UserProfile) => void;
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  return (
    <Card className="w-full absolute top-full bg-popover border-primary/10 shadow-lg z-50 overflow-hidden">
      <ScrollArea className="max-h-[300px]">
        <div className="p-1">
          {results.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect?.(profile)}
              className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors rounded-md"
            >
              <UserAvatar user={profile} className="h-10 w-10" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{profile.full_name}</p>
                  {profile.online_status && (
                    <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {profile.role && (
                    <p className="text-xs text-muted-foreground truncate">
                      {profile.role === 'professional' ? 'Professionnel' : 
                      profile.role === 'business' ? 'Entreprise' : 'Admin'}
                    </p>
                  )}
                  
                  {profile.city && (
                    <p className="text-xs text-muted-foreground truncate">
                      • {profile.city}
                    </p>
                  )}
                </div>
                
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.skills.slice(0, 2).map((skill, i) => (
                      <Badge key={i} variant="outline" className="px-1 py-0 text-[10px]">
                        {skill}
                      </Badge>
                    ))}
                    {profile.skills.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{profile.skills.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
