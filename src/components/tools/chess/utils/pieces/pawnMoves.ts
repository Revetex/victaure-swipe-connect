
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition } from "../moveValidation";

export function calculatePawnMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][]
): { row: number; col: number; }[] {
  const moves: { row: number; col: number; }[] = [];
  const direction = piece.isWhite ? -1 : 1;
  const startRow = piece.isWhite ? 6 : 1;

  // Mouvement vers l'avant d'une case
  const oneForward = row + direction;
  if (isValidPosition(oneForward, col) && !board[oneForward][col]) {
    moves.push({ row: oneForward, col });

    // Mouvement initial de deux cases
    if (row === startRow) {
      const twoForward = row + (2 * direction);
      if (!board[twoForward][col]) {
        moves.push({ row: twoForward, col });
      }
    }
  }

  // Captures en diagonale
  const captureCols = [col - 1, col + 1];
  for (const captureCol of captureCols) {
    if (isValidPosition(oneForward, captureCol)) {
      const targetPiece = board[oneForward][captureCol];
      if (targetPiece && targetPiece.isWhite !== piece.isWhite) {
        moves.push({ row: oneForward, col: captureCol });
      }
    }
  }

  return moves;
}

function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
