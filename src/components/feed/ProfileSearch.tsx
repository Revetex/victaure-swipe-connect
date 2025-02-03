import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileSearchProps {
  onSelect: (profile: any) => void;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ onSelect, placeholder = "Search...", className }: ProfileSearchProps) {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchProfiles = async () => {
      if (!query.trim()) {
        setProfiles([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(5);

        if (error) throw error;
        setProfiles(data || []);
      } catch (error) {
        console.error("Error searching profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchProfiles, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <Command className={cn("relative rounded-lg border shadow-md", className)}>
      <div className="flex items-center border-b px-3">
        <Search className="h-4 w-4 shrink-0 opacity-50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder}
        />
      </div>
      {query.length > 0 && (
        <ul className="max-h-[300px] overflow-y-auto p-2">
          {isLoading ? (
            <li className="py-2 px-4 text-sm text-muted-foreground">Searching...</li>
          ) : profiles.length > 0 ? (
            profiles.map((profile) => (
              <li key={profile.id}>
                <button
                  className="w-full rounded-md px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => onSelect(profile)}
                >
                  <span className="font-medium">{profile.full_name}</span>
                  <span className="ml-2 text-muted-foreground">{profile.email}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="py-2 px-4 text-sm text-muted-foreground">No results found.</li>
          )}
        </ul>
      )}
    </Command>
  );
};