import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Dispatch, SetStateAction } from "react";
export interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (search: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  sortBy: "likes" | "comments" | "date";
  onSortByChange: Dispatch<SetStateAction<"likes" | "comments" | "date">>;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  onCreatePost: () => void;
}
export function PostFilters({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onCreatePost
}: PostFiltersProps) {
  return;
}