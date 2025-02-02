import { ProfileSearch } from "./feed/ProfileSearch";
import { CreatePost } from "./feed/CreatePost";
import { PostList } from "./feed/PostList";
import { FriendsList } from "./feed/FriendsList";
import { useQueryClient } from "@tanstack/react-query";
import { Messages } from "./Messages";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function Feed() {
  const queryClient = useQueryClient();

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileSearch />
          <CreatePost onPostCreated={handlePostCreated} />
          <PostList />
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <Tabs defaultValue="friends" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="friends" className="flex-1">Amis</TabsTrigger>
                <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
              </TabsList>
              <TabsContent value="friends">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <FriendsList />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="messages">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <Messages />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}