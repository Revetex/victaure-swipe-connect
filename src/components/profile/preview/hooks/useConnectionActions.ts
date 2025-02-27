
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

  const handleToggleBlock = () => {
    console.log("Toggling block status");
  };

  return {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock
  };
}
