
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition } from "../moveValidation";

const KING_MOVES = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1]
] as const;

export function calculateKingMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][]
): { row: number; col: number; }[] {
  const moves: { row: number; col: number; }[] = [];

  for (const [rowOffset, colOffset] of KING_MOVES) {
    if (canMoveToPosition(row + rowOffset, col + colOffset, piece, board)) {
      moves.push({ row: row + rowOffset, col: col + colOffset });
    }
  }

  return moves;
}
