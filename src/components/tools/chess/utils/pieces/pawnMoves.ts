
import { ChessPiece } from "@/types/chess";
import { isValidPosition, canMoveToPosition } from "../moveValidation";

export function calculatePawnMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][]
): { row: number; col: number }[] {
  const moves: { row: number; col: number }[] = [];
  const direction = piece.isWhite ? -1 : 1; // Les pions blancs se déplacent vers le haut (diminution de row), les noirs vers le bas
  const startingRow = piece.isWhite ? 6 : 1; // Ligne de départ des pions

  // Déplacement d'une case vers l'avant
  const newRow = row + direction;
  if (isValidPosition(newRow, col) && board[newRow][col] === null) {
    moves.push({ row: newRow, col });

    // Déplacement de deux cases depuis la position de départ
    if (row === startingRow) {
      const twoAhead = row + 2 * direction;
      if (isValidPosition(twoAhead, col) && board[twoAhead][col] === null) {
        moves.push({ row: twoAhead, col });
      }
    }
  }

  // Captures en diagonale
  const captureDirections = [{ row: direction, col: -1 }, { row: direction, col: 1 }];
  captureDirections.forEach(dir => {
    const captureRow = row + dir.row;
    const captureCol = col + dir.col;
    
    if (isValidPosition(captureRow, captureCol)) {
      const targetPiece = board[captureRow][captureCol];
      if (targetPiece && targetPiece.isWhite !== piece.isWhite) {
        moves.push({ row: captureRow, col: captureCol });
      }
    }
  });

  return moves;
}
