
import { ChessPiece } from "@/types/chess";

export function calculatePossibleMoves(
  row: number, 
  col: number, 
  piece: ChessPiece, 
  board: (ChessPiece | null)[][]
): { row: number; col: number; }[] {
  const moves: { row: number; col: number; }[] = [];
  
  // Basic move validation
  function isValidPosition(r: number, c: number): boolean {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }

  function canMoveToPosition(r: number, c: number): boolean {
    if (!isValidPosition(r, c)) return false;
    const targetPiece = board[r][c];
    return !targetPiece || targetPiece.isWhite !== piece.isWhite;
  }

  // Implement basic movement patterns for each piece type
  switch (piece.type) {
    case 'pawn': {
      const direction = piece.isWhite ? -1 : 1;
      if (canMoveToPosition(row + direction, col) && !board[row + direction][col]) {
        moves.push({ row: row + direction, col });
        // First move can be 2 squares
        if (
          ((piece.isWhite && row === 6) || (!piece.isWhite && row === 1)) &&
          !board[row + direction][col] &&
          !board[row + 2 * direction][col]
        ) {
          moves.push({ row: row + 2 * direction, col });
        }
      }
      // Capture diagonally
      for (const colOffset of [-1, 1]) {
        if (canMoveToPosition(row + direction, col + colOffset) && 
            board[row + direction][col + colOffset]?.isWhite !== piece.isWhite) {
          moves.push({ row: row + direction, col: col + colOffset });
        }
      }
      break;
    }

    case 'rook': {
      // Horizontal and vertical movements
      for (const [rowDir, colDir] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        let r = row + rowDir;
        let c = col + colDir;
        while (canMoveToPosition(r, c)) {
          moves.push({ row: r, col: c });
          if (board[r][c]) break;
          r += rowDir;
          c += colDir;
        }
      }
      break;
    }

    case 'knight': {
      // L-shaped movements
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [rowOffset, colOffset] of knightMoves) {
        if (canMoveToPosition(row + rowOffset, col + colOffset)) {
          moves.push({ row: row + rowOffset, col: col + colOffset });
        }
      }
      break;
    }

    case 'bishop': {
      // Diagonal movements
      for (const [rowDir, colDir] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        let r = row + rowDir;
        let c = col + colDir;
        while (canMoveToPosition(r, c)) {
          moves.push({ row: r, col: c });
          if (board[r][c]) break;
          r += rowDir;
          c += colDir;
        }
      }
      break;
    }

    case 'queen': {
      // Combine rook and bishop movements
      for (const [rowDir, colDir] of [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ]) {
        let r = row + rowDir;
        let c = col + colDir;
        while (canMoveToPosition(r, c)) {
          moves.push({ row: r, col: c });
          if (board[r][c]) break;
          r += rowDir;
          c += colDir;
        }
      }
      break;
    }

    case 'king': {
      // One square in any direction
      for (const [rowOffset, colOffset] of [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ]) {
        if (canMoveToPosition(row + rowOffset, col + colOffset)) {
          moves.push({ row: row + rowOffset, col: col + colOffset });
        }
      }
      break;
    }
  }
  
  return moves;
}
