import { SYSTEM_PROMPT } from "./config";
import { generateAIResponse } from "./apiClient";
import { getUserProfile, formatSystemPrompt } from "./profileService";
import { saveMessage, loadMessages, deleteAllMessages } from "./messageService";
import type { Message } from "@/types/chat/messageTypes";

export {
  generateAIResponse,
  saveMessage,
  loadMessages,
  deleteAllMessages
};

export async function generatePersonalizedAIResponse(message: string): Promise<string> {
  const profile = await getUserProfile();
  const personalizedPrompt = formatSystemPrompt(profile, SYSTEM_PROMPT);
  return generateAIResponse(message, personalizedPrompt);
}