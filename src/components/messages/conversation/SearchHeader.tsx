import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface SearchHeaderProps {
  unreadCount: number;
  onSearch: (value: string) => void;
  onNewConversation: () => void;
  onSelectFriend: (friendId: string) => void;
}

export function SearchHeader({ 
  unreadCount, 
  onSearch, 
  onNewConversation,
  onSelectFriend 
}: SearchHeaderProps) {
  const { profile } = useProfile();

  return (
    <div className="border-b p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Messages</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-4 p-4">
              <h2 className="text-lg font-semibold">Nouvelle conversation</h2>
              <Button 
                onClick={onNewConversation}
                className="w-full"
              >
                Parler avec M. Victaure
              </Button>
              {profile?.friends?.map((friend) => (
                <Button
                  key={friend.id}
                  onClick={() => onSelectFriend(friend.id)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {friend.full_name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          className="pl-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}