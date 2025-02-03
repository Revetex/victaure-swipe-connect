import { ReactNode } from "react";

interface FriendListHeaderProps {
  icon: ReactNode;
  title: string;
}

export function FriendListHeader({ icon, title }: FriendListHeaderProps) {
  return (
    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h3>
  );
}