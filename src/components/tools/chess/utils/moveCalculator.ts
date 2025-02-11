
import { ChessPiece } from "@/types/chess";

export function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

type BoardState = (ChessPiece | null)[][];

export function calculatePossibleMoves(
  fromRow: number, 
  fromCol: number, 
  piece: ChessPiece, 
  board: BoardState
): { row: number; col: number }[] {
  const moves: { row: number; col: number }[] = [];

  const isPathClear = (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const rowStep = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    const colStep = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;
    
    let currentRow = startRow + rowStep;
    let currentCol = startCol + colStep;
    
    while (currentRow !== endRow || currentCol !== endCol) {
      if (!isValidPosition(currentRow, currentCol) || board[currentRow][currentCol]) {
        return false;
      }
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

      // Forward movement
      const oneStep = fromRow + direction;
      if (isValidPosition(oneStep, fromCol) && !board[oneStep][fromCol]) {
        addMove(oneStep, fromCol);
        
        // Double move from starting position
        if (fromRow === startRow) {
          const twoSteps = fromRow + 2 * direction;
          if (isValidPosition(twoSteps, fromCol) && !board[twoSteps][fromCol]) {
            addMove(twoSteps, fromCol);
          }
        }
      }

      // Diagonal captures
      for (const colOffset of [-1, 1]) {
        const captureRow = fromRow + direction;
        const captureCol = fromCol + colOffset;
        if (isValidPosition(captureRow, captureCol)) {
          const target = board[captureRow][captureCol];
          if (target && target.isWhite !== piece.isWhite) {
            addMove(captureRow, captureCol);
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
        const newRow = fromRow + rowOffset;
        const newCol = fromCol + colOffset;
        addMove(newRow, newCol);
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
        const newRow = fromRow + dRow;
        const newCol = fromCol + dCol;
        addMove(newRow, newCol);
      }
      break;
    }
  }
  
  return moves;
}
