
import { ChessPiece } from "@/types/chess";

export function initializeBoard(): (ChessPiece | null)[][] {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Initialize pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', isWhite: false };
    board[6][i] = { type: 'pawn', isWhite: true };
  }

  // Initialize other pieces
  const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: backRow[i] as ChessPiece['type'], isWhite: false };
    board[7][i] = { type: backRow[i] as ChessPiece['type'], isWhite: true };
  }

  return board;
}

export function getSquareName(row: number, col: number): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return `${files[col]}${8 - row}`;
}

export function calculatePossibleMoves(
  fromRow: number,
  fromCol: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][]
): { row: number; col: number }[] {
  const moves: { row: number; col: number }[] = [];

  const isValidPosition = (row: number, col: number) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const isPathClear = (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const rowStep = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    const colStep = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;
    
    let currentRow = startRow + rowStep;
    let currentCol = startCol + colStep;
    
    while (currentRow !== endRow || currentCol !== endCol) {
      if (board[currentRow][currentCol]) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  };

  const addMove = (row: number, col: number) => {
    if (isValidPosition(row, col)) {
      const targetPiece = board[row][col];
      if (!targetPiece || targetPiece.isWhite !== piece.isWhite) {
        moves.push({ row, col });
      }
    }
  };

  switch (piece.type) {
    case 'pawn': {
      const direction = piece.isWhite ? -1 : 1;
      const startRow = piece.isWhite ? 6 : 1;

      if (!board[fromRow + direction]?.[fromCol]) {
        addMove(fromRow + direction, fromCol);
        if (fromRow === startRow && !board[fromRow + 2 * direction]?.[fromCol]) {
          addMove(fromRow + 2 * direction, fromCol);
        }
      }

      for (const colOffset of [-1, 1]) {
        if (isValidPosition(fromRow + direction, fromCol + colOffset)) {
          const target = board[fromRow + direction][fromCol + colOffset];
          if (target && target.isWhite !== piece.isWhite) {
            addMove(fromRow + direction, fromCol + colOffset);
          }
        }
      }
      break;
    }

    case 'rook': {
      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dRow, dCol] of directions) {
        for (let i = 1; i < 8; i++) {
          const newRow = fromRow + i * dRow;
          const newCol = fromCol + i * dCol;
          if (!isValidPosition(newRow, newCol)) break;
          const target = board[newRow][newCol];
          if (target) {
            if (target.isWhite !== piece.isWhite) {
              addMove(newRow, newCol);
            }
            break;
          }
          addMove(newRow, newCol);
        }
      }
      break;
    }

    case 'knight': {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [rowOffset, colOffset] of knightMoves) {
        addMove(fromRow + rowOffset, fromCol + colOffset);
      }
      break;
    }

    case 'bishop': {
      const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dRow, dCol] of directions) {
        for (let i = 1; i < 8; i++) {
          const newRow = fromRow + i * dRow;
          const newCol = fromCol + i * dCol;
          if (!isValidPosition(newRow, newCol)) break;
          const target = board[newRow][newCol];
          if (target) {
            if (target.isWhite !== piece.isWhite) {
              addMove(newRow, newCol);
            }
            break;
          }
          addMove(newRow, newCol);
        }
      }
      break;
    }

    case 'queen': {
      const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ];
      for (const [dRow, dCol] of directions) {
        for (let i = 1; i < 8; i++) {
          const newRow = fromRow + i * dRow;
          const newCol = fromCol + i * dCol;
          if (!isValidPosition(newRow, newCol)) break;
          const target = board[newRow][newCol];
          if (target) {
            if (target.isWhite !== piece.isWhite) {
              addMove(newRow, newCol);
            }
            break;
          }
          addMove(newRow, newCol);
        }
      }
      break;
    }

    case 'king': {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      for (const [dRow, dCol] of directions) {
        addMove(fromRow + dRow, fromCol + dCol);
      }
      break;
    }
  }
  
  return moves;
}
