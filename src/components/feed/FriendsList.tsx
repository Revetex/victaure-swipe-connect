import { FriendListContainer } from "./friends/FriendListContainer";

export function FriendsList() {
  return (
    <div className="fixed top-[5.5rem] right-4 w-[calc(33.333333%-2rem)]">
      <FriendListContainer />
    </div>
  );
}