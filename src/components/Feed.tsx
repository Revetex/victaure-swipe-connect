import { ProfileSearch } from "./feed/ProfileSearch";
import { CreatePost } from "./feed/CreatePost";
import { PostList } from "./feed/PostList";
import { FriendsList } from "./feed/FriendsList";
import { useQueryClient } from "@tanstack/react-query";

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
          <div className="sticky top-24">
            <FriendsList />
          </div>
        </div>
      </div>
    </div>
  );
}