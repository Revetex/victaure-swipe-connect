
import { MessagesContainer } from "./messages/MessagesContainer";

export function Messages() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      <MessagesContainer />
    </div>
  );
}
