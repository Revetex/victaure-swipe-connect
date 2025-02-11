
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      console.log("Requesting AI move...");
      const { data, error } = await supabase.functions.invoke('chess-ai-move', {
        body: { 
          board,
          difficulty
        }
      });

      console.log("AI response:", data);

      if (error) {
        console.error('AI move error:', error);
        throw error;
      }

      if (data?.move) {
        onMove(data.move.from, data.move.to);
      }

      if (data?.gameOver) {
        onGameOver();
      }
    } catch (error) {
      console.error('AI move error:', error);
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
