
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChessPiece } from "@/types/chess";
import { toast } from "sonner";

export function useChessAI() {
  const [isThinking, setIsThinking] = useState(false);

  const makeAIMove = async (
    board: (ChessPiece | null)[][],
    difficulty: string,
    onMove: (from: { row: number, col: number }, to: { row: number, col: number }) => void,
    onGameOver: () => void
  ) => {
    setIsThinking(true);
    
    try {
      console.log("Requesting AI move with difficulty:", difficulty);
      console.log("Current board state:", board);
      
      const { data, error } = await supabase.functions.invoke('chess-ai-move', {
        body: { 
          board,
          difficulty
        }
      });

      console.log("AI response:", data);

      if (error) {
        console.error('AI move error:', error);
        toast.error("Erreur lors du calcul du coup de l'IA");
        throw error;
      }

      if (data?.gameOver) {
        onGameOver();
        return;
      }

      if (data?.move) {
        onMove(data.move.from, data.move.to);
      } else {
        console.error('Invalid AI response:', data);
        toast.error("Réponse invalide de l'IA");
      }
    } catch (error) {
      console.error('AI move error:', error);
      toast.error("Erreur lors du coup de l'IA");
      throw error;
    } finally {
      setIsThinking(false);
    }
  };

  return {
    isThinking,
    makeAIMove
  };
}
