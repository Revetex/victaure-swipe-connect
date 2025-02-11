
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getSquareName } from "./boardUtils";
import { ChessPiece } from "@/types/chess";

type BoardState = (ChessPiece | null)[][];

export async function handleAIMove(
  board: BoardState,
  difficulty: string,
  setBoard: (board: BoardState) => void,
  setMoveHistory: (fn: (prev: string[]) => string[]) => void,
  setGameOver: (over: boolean) => void,
  setIsThinking: (thinking: boolean) => void,
  setIsWhiteTurn: (isWhite: boolean) => void
) {
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
      const aiMove = `${getSquareName(from.row, from.col)} → ${getSquareName(to.row, to.col)}`;
      setMoveHistory(prev => [...prev, aiMove]);
      
      const aiBoard = [...board];
      aiBoard[to.row][to.col] = aiBoard[from.row][from.col];
      aiBoard[from.row][from.col] = null;
      setBoard(aiBoard);
    }

    if (data.gameOver) {
      setGameOver(true);
      toast.success("Échec et mat ! Partie terminée");
    }
  } catch (error) {
    console.error('AI move error:', error);
    toast.error("Erreur lors du coup de l'IA");
  } finally {
    setIsThinking(false);
    setIsWhiteTurn(true);
  }
}
