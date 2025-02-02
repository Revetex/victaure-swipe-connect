import { ProfileSearch } from "./feed/ProfileSearch";
import { CreatePost } from "./feed/CreatePost";
import { PostList } from "./feed/PostList";
import { useQueryClient } from "@tanstack/react-query";

export function Feed() {
  const queryClient = useQueryClient();

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ProfileSearch />
      <CreatePost onPostCreated={handlePostCreated} />
      <PostList />
    </div>
  );
}