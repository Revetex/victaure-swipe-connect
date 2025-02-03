import { CreatePost } from "./feed/CreatePost";
import { PostList } from "./feed/PostList";
import { FriendsList } from "./feed/FriendsList";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Feed() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const MobileFriendsList = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg bg-background/95 backdrop-blur-sm"
        >
          <Users className="h-4 w-4 mr-2" />
          Amis
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <div className="h-full overflow-y-auto pb-20">
          <FriendsList />
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CreatePost onPostCreated={handlePostCreated} />
          <PostList />
        </div>
        {isMobile ? (
          <MobileFriendsList />
        ) : (
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <FriendsList />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}