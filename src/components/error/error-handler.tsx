import { useEffect } from "react";
import { toast } from "sonner";

interface ErrorHandlerProps {
  error: Error | null;
}

export function ErrorHandler({ error }: ErrorHandlerProps) {
  useEffect(() => {
    if (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.", {
        duration: 5000,
      });
    }
  }, [error]);

  return null;
}