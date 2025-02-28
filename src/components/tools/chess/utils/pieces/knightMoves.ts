
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition } from "../moveValidation";

const KNIGHT_PATTERNS = [
  { row: -2, col: -1 },
  { row: -2, col: 1 },
  { row: -1, col: -2 },
  { row: -1, col: 2 },
  { row: 1, col: -2 },
  { row: 1, col: 2 },
  { row: 2, col: -1 },
  { row: 2, col: 1 }
];

export function calculateKnightMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][]
): { row: number; col: number }[] {
  const moves: { row: number; col: number }[] = [];

  KNIGHT_PATTERNS.forEach(pattern => {
    const newRow = row + pattern.row;
    const newCol = col + pattern.col;
    
    if (canMoveToPosition(newRow, newCol, piece, board)) {
      moves.push({ row: newRow, col: newCol });
    }
  });

  return moves;
}
