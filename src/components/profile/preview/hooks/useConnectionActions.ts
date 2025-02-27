
export function useConnectionActions(profileId?: string) {
  const handleAddFriend = () => {
    console.log("Adding friend", profileId);
  };

  const handleAcceptFriend = () => {
    console.log("Accepting friend request", profileId);
  };

  const handleRemoveFriend = () => {
    console.log("Removing friend", profileId);
  };

  const handleToggleBlock = (profileId?: string) => {
    console.log("Toggling block status", profileId);
  };

  return {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock
  };
}
