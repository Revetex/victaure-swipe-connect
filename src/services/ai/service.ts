import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/types/chat/messageTypes";

export const generateAIResponse = async (message: string, model?: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("No active session");
    }

    const response = await fetch(
      "https://mfjllillnpleasclqabb.supabase.co/functions/v1/ai-chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message,
          userId: session.user.id,
          model: model || "mistralai/Mixtral-8x7B-Instruct-v0.1"
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};

export const saveMessage = async (message: Message) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("No active session");
    }

    const { error } = await supabase.from("ai_chat_messages").insert({
      user_id: session.user.id,
      content: message.content,
      sender: message.sender,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

export const deleteAllMessages = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("No active session");
    }

    const { error } = await supabase
      .from("ai_chat_messages")
      .delete()
      .eq("user_id", session.user.id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting messages:", error);
    throw error;
  }
};