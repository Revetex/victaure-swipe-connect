import { useState, useCallback } from "react";

type MessageType = {
  role: "assistant" | "user";
  content: string;
  type?: "job_creation" | "text";
  step?: "title" | "description" | "budget" | "location" | "category" | "confirm";
};

export function useChat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [currentStep, setCurrentStep] = useState<MessageType["step"]>();

  const addMessage = useCallback((message: MessageType) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleJobCreation = useCallback((userInput: string) => {
    if (userInput.toLowerCase().includes("créer") && userInput.toLowerCase().includes("mission")) {
      setIsCreatingJob(true);
      setCurrentStep("title");
      addMessage({
        role: "assistant",
        content: "D'accord, je vais vous aider à créer une nouvelle mission. Quel est le titre de la mission ?",
        type: "job_creation",
        step: "title"
      });
      return true;
    }
    return false;
  }, [addMessage]);

  const handleJobResponse = useCallback((response: string) => {
    addMessage({ role: "user", content: response });

    switch (currentStep) {
      case "title":
        setCurrentStep("description");
        addMessage({
          role: "assistant",
          content: "Super ! Maintenant, pouvez-vous me donner une description détaillée de la mission ?",
          type: "job_creation",
          step: "description"
        });
        break;
      case "description":
        setCurrentStep("budget");
        addMessage({
          role: "assistant",
          content: "Excellent ! Quel est le budget prévu pour cette mission (en CAD) ?",
          type: "job_creation",
          step: "budget"
        });
        break;
      case "budget":
        setCurrentStep("location");
        addMessage({
          role: "assistant",
          content: "Parfait ! Où se déroulera cette mission ?",
          type: "job_creation",
          step: "location"
        });
        break;
      case "location":
        setCurrentStep("category");
        addMessage({
          role: "assistant",
          content: "Presque terminé ! Dans quelle catégorie classeriez-vous cette mission ?",
          type: "job_creation",
          step: "category"
        });
        break;
      case "category":
        setCurrentStep("confirm");
        addMessage({
          role: "assistant",
          content: "Excellent ! Voici un récapitulatif de la mission. Voulez-vous confirmer la création ou modifier quelque chose ?",
          type: "job_creation",
          step: "confirm"
        });
        break;
      case "confirm":
        if (response === "modifier") {
          setCurrentStep("title");
          addMessage({
            role: "assistant",
            content: "D'accord, reprenons depuis le début. Quel est le titre de la mission ?",
            type: "job_creation",
            step: "title"
          });
        } else {
          setIsCreatingJob(false);
          setCurrentStep(undefined);
        }
        break;
    }
  }, [currentStep, addMessage]);

  const sendMessage = useCallback((content: string) => {
    addMessage({ role: "user", content });

    if (!isCreatingJob && handleJobCreation(content)) {
      return;
    }

    // Handle other types of messages here
    if (!isCreatingJob) {
      addMessage({
        role: "assistant",
        content: "Je peux vous aider à créer une nouvelle mission. Il suffit de me le demander !"
      });
    }
  }, [addMessage, handleJobCreation, isCreatingJob]);

  return {
    messages,
    sendMessage,
    handleJobResponse,
    isCreatingJob
  };
}