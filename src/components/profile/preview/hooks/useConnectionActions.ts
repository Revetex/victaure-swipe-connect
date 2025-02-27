
export function useConnectionActions() {
  const handleAddFriend = () => {
    console.log("Adding friend");
  };

  const handleAcceptFriend = () => {
    console.log("Accepting friend request");
  };

  const handleRemoveFriend = () => {
    console.log("Removing friend");
  };

  return {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend
  };
}
