
import { Card } from "@/components/ui/card";
import { ConversationView } from "./conversation/ConversationView";
import { ConversationList } from "./conversation/ConversationList";
import { useMessagesContainer } from "./hooks/useMessagesContainer";

export function MessagesContainer() {
  const {
    receiver,
    messages,
    filteredConversations,
    aiMessages,
    inputMessage,
    isThinking,
    searchQuery,
    showConversation,
    messagesEndRef,
    setInputMessage,
    setSearchQuery,
    handleSendMessage,
    handleStartNewChat,
    handleRefresh,
    handleDeleteConversation,
    setShowConversation,
    setReceiver
  } = useMessagesContainer();

  return (
    <Card className="h-screen flex flex-col mt-16">
      <div className="flex-1 relative bg-gradient-to-b from-background to-muted/20">
        {showConversation && receiver ? (
          <ConversationView
            messages={messages}
            receiver={receiver}
            inputMessage={inputMessage}
            isThinking={isThinking}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
            onBack={() => {
              setShowConversation(false);
              setReceiver(null);
            }}
            onDelete={() => handleDeleteConversation(receiver)}
            messagesEndRef={messagesEndRef}
          />
        ) : (
          <ConversationList
            conversations={filteredConversations}
            aiMessages={aiMessages}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={handleRefresh}
            onSelectConversation={(receiver) => {
              setReceiver(receiver);
              setShowConversation(true);
            }}
            onStartNewChat={handleStartNewChat}
          />
        )}
      </div>
    </Card>
  );
}
