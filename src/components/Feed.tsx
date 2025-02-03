import { CreatePost } from "./feed/CreatePost";
import { PostList } from "./feed/PostList";
import { FriendsList } from "./feed/FriendsList";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Feed() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CreatePost onPostCreated={handlePostCreated} />
          <PostList />
        </div>
        {isMobile ? (
          <div className="fixed bottom-20 right-4 z-50">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
                  <Users className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <FriendsList />
              </SheetContent>
            </Sheet>
          </div>
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