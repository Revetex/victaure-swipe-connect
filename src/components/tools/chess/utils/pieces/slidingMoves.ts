
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition } from "../moveValidation";

export type Direction = [number, number];

export function calculateSlidingMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][],
  directions: Direction[]
): { row: number; col: number; }[] {
  const moves: { row: number; col: number; }[] = [];

  for (const [rowDir, colDir] of directions) {
    let r = row + rowDir;
    let c = col + colDir;
    while (canMoveToPosition(r, c, piece, board)) {
      moves.push({ row: r, col: c });
      if (board[r][c]) break;
      r += rowDir;
      c += colDir;
    }
  }

  return moves;
}

export const ORTHOGONAL_DIRECTIONS: Direction[] = [
  [0, 1], [0, -1], [1, 0], [-1, 0]
];

export const DIAGONAL_DIRECTIONS: Direction[] = [
  [1, 1], [1, -1], [-1, 1], [-1, -1]
];

export const ALL_DIRECTIONS: Direction[] = [
  ...ORTHOGONAL_DIRECTIONS,
  ...DIAGONAL_DIRECTIONS
];
