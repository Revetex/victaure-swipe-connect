
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition } from "../moveValidation";

const KING_PATTERNS = [
  { row: -1, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 }
];

export function calculateKingMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][]
): { row: number; col: number }[] {
  const moves: { row: number; col: number }[] = [];

  KING_PATTERNS.forEach(pattern => {
    const newRow = row + pattern.row;
    const newCol = col + pattern.col;
    
    if (canMoveToPosition(newRow, newCol, piece, board)) {
      moves.push({ row: newRow, col: newCol });
    }
  });

  return moves;
}
