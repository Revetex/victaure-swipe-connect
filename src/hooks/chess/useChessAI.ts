
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getSquareName } from "./chessUtils";
import { ChessPiece } from "@/types/chess";

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
      const { data, error } = await supabase.functions.invoke('chess-ai-move', {
        body: { 
          board: board,
          difficulty: difficulty
        }
      });

      if (error) throw error;

      if (data.move) {
        const { from, to } = data.move;
        onMove(from, to);
      }

      if (data.gameOver) {
        onGameOver();
      }
    } catch (error) {
      console.error('AI move error:', error);
      toast.error("Erreur lors du coup de l'IA");
    } finally {
      setIsThinking(false);
    }
  };

  return {
    isThinking,
    makeAIMove
  };
}
