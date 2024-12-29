import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: uuidv4(),
    content: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
    sender: "assistant",
    timestamp: new Date(),
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsThinking(true);

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Tu es un assistant professionnel qui aide les utilisateurs dans leur recherche d\'emploi. Sois précis et concis dans tes réponses.'
            },
            ...messages.map(msg => ({
              role: msg.sender === 'assistant' ? 'assistant' : 'user',
              content: msg.content
            })),
            {
              role: 'user',
              content: inputMessage
            }
          ],
          temperature: 0.2,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = {
        id: uuidv4(),
        content: data.choices[0].message.content,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Fallback responses in case of error
      const fallbackResponses = [
        "Je suis là pour vous aider dans votre recherche d'emploi. Que puis-je faire pour vous ?",
        "Je peux vous donner des conseils sur la rédaction de votre CV.",
        "N'hésitez pas à me poser des questions sur les entretiens d'embauche.",
        "Je peux vous aider à identifier vos compétences clés.",
        "Voulez-vous des conseils pour votre recherche d'emploi ?",
        "Je peux vous aider à préparer votre lettre de motivation.",
        "Avez-vous besoin d'aide pour définir votre projet professionnel ?",
        "Je peux vous donner des astuces pour développer votre réseau professionnel.",
      ];
      
      const fallbackMessage: Message = {
        id: uuidv4(),
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      toast.error("Désolé, je n'ai pas pu répondre. Veuillez réessayer.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      toast.error("Erreur lors de la reconnaissance vocale");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    inputMessage,
    isListening,
    isThinking,
    setMessages,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat,
  };
}