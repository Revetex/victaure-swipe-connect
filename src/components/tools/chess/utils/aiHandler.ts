
import { ChessPiece } from "@/types/chess";
import { calculatePossibleMoves } from "./moveCalculator";

// Simple evaluation function for the AI
function evaluatePosition(board: (ChessPiece | null)[][]): number {
  const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 100
  };

  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = pieceValues[piece.type];
        score += piece.isWhite ? -value : value;
      }
    }
  }
  return score;
}

// Find all possible moves for the AI
function findAllPossibleMoves(board: (ChessPiece | null)[][], isWhiteTurn: boolean) {
  const moves: { from: { row: number; col: number }; to: { row: number; col: number } }[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.isWhite === isWhiteTurn) {
        const possibleMoves = calculatePossibleMoves(row, col, piece, board);
        possibleMoves.forEach(move => {
          moves.push({
            from: { row, col },
            to: { row: move.row, col: move.col }
          });
        });
      }
    }
  }

  return moves;
}

// Make a move and return the new board state
function makeMove(board: (ChessPiece | null)[][], from: { row: number; col: number }, to: { row: number; col: number }): (ChessPiece | null)[][] {
  const newBoard = board.map(row => [...row]);
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  return newBoard;
}

export async function handleAIMove(
  board: (ChessPiece | null)[][],
  difficulty: string,
  setBoard: (board: (ChessPiece | null)[][]) => void,
  setMoveHistory: (history: (prev: string[]) => string[]) => void,
  setGameOver: (over: boolean) => void,
  setIsThinking: (thinking: boolean) => void,
  setIsWhiteTurn: (isWhiteTurn: boolean) => void,
): Promise<void> {
  setIsThinking(true);

  // Simulate AI thinking time based on difficulty
  const thinkingTime = {
    easy: 500,
    medium: 1000,
    hard: 1500
  }[difficulty] || 1000;

  await new Promise(resolve => setTimeout(resolve, thinkingTime));

  const possibleMoves = findAllPossibleMoves(board, false);
  
  if (possibleMoves.length === 0) {
    setGameOver(true);
    setIsThinking(false);
    return;
  }

  // For medium and hard difficulties, evaluate positions
  let selectedMove;
  if (difficulty === 'easy') {
    // Random move for easy difficulty
    selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  } else {
    // Evaluate each move and select the best one
    let bestScore = -Infinity;
    selectedMove = possibleMoves[0];

    possibleMoves.forEach(move => {
      const newBoard = makeMove(board, move.from, move.to);
      const score = evaluatePosition(newBoard);
      
      // Add some randomness for medium difficulty
      const randomFactor = difficulty === 'medium' ? Math.random() * 2 - 1 : 0;
      
      if (score + randomFactor > bestScore) {
        bestScore = score + randomFactor;
        selectedMove = move;
      }
    });
  }

  // Make the selected move
  const newBoard = makeMove(board, selectedMove.from, selectedMove.to);
  setBoard(newBoard);
  
  // Add move to history
  const moveNotation = `${String.fromCharCode(97 + selectedMove.from.col)}${8 - selectedMove.from.row} → ${String.fromCharCode(97 + selectedMove.to.col)}${8 - selectedMove.to.row}`;
  setMoveHistory(prev => [...prev, moveNotation]);
  
  setIsWhiteTurn(true);
  setIsThinking(false);
}
