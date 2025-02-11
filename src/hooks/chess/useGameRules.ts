
import { ChessPiece } from "@/types/chess";
import { toast } from "sonner";

export function useGameRules() {
  const checkForKing = (board: (ChessPiece | null)[][]): boolean => {
    let blackKingFound = false;
    let whiteKingFound = false;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece?.type === 'king') {
          if (piece.isWhite) {
            whiteKingFound = true;
          } else {
            blackKingFound = true;
          }
        }
      }
    }

    if (!blackKingFound) {
      toast.success("Félicitations ! Vous avez gagné en capturant le roi noir !");
      return true;
    }
    if (!whiteKingFound) {
      toast.success("L'IA a gagné en capturant votre roi !");
      return true;
    }

    return false;
  };

  return {
    checkForKing
  };
}
