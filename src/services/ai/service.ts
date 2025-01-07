export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: number;
  sender: 'user' | 'assistant';
}

export const sendMessage = async (message: string): Promise<Message> => {
  try {
    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return {
      id: crypto.randomUUID(),
      content: data.response,
      timestamp: Date.now(),
      sender: 'assistant',
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const generateAIResponse = async (message: string): Promise<string> => {
  const response = await sendMessage(message);
  return response.content;
};

export const saveMessage = async (message: Message): Promise<void> => {
  // Implementation for saving message to database
  console.log('Saving message:', message);
};

export const loadMessages = async (): Promise<Message[]> => {
  // Implementation for loading messages from database
  return [];
};

export const deleteAllMessages = async (): Promise<void> => {
  // Implementation for deleting all messages
  console.log('Deleting all messages');
};