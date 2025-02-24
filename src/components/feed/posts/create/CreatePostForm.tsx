
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/UserAvatar";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function CreatePostForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const { profile } = useProfile();
  const isMobile = useIsMobile();

  if (!profile) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    // ... implémentation de la soumission
    setContent("");
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setContent("");
    setIsExpanded(false);
  };

  return (
    <div className="sticky top-16 z-40 w-full">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-background border-b border-border/20 shadow-lg"
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <UserAvatar user={profile} className="h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <Input 
                    placeholder="Quoi de neuf ?" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={handleCancel}>
                      Annuler
                    </Button>
                    <Button size="sm" onClick={handleSubmit}>
                      Publier
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "w-full px-4 py-2",
              "bg-background",
              "border-b border-border/20",
              "shadow-sm backdrop-blur-sm"
            )}
          >
            <div
              onClick={() => setIsExpanded(true)}
              className={cn(
                "flex items-center gap-3",
                "w-full cursor-pointer",
                "rounded-full",
                "bg-muted",
                "border border-border/20",
                "px-4 py-2",
                "transition-all duration-200",
                "hover:bg-muted/80"
              )}
            >
              <UserAvatar user={profile} className="h-8 w-8" />
              <span className="text-sm text-muted-foreground">
                Quoi de neuf, {profile.full_name?.split(" ")[0]} ?
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
