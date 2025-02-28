
import { ChessPiece } from "@/types/chess";
import { calculatePossibleMoves } from "./moveCalculator";
import { toast } from "sonner";

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

  // Points for position control (center squares are worth more)
  const positionValues = [
    [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
    [0.1, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1],
    [0.1, 0.2, 0.3, 0.3, 0.3, 0.3, 0.2, 0.1],
    [0.1, 0.2, 0.3, 0.4, 0.4, 0.3, 0.2, 0.1],
    [0.1, 0.2, 0.3, 0.4, 0.4, 0.3, 0.2, 0.1],
    [0.1, 0.2, 0.3, 0.3, 0.3, 0.3, 0.2, 0.1],
    [0.1, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1],
    [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
  ];

  let score = 0;
  let mobilityScore = 0;
  
  // Evaluate pieces values and positions
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        // Base piece value
        const value = pieceValues[piece.type];
        
        // Adjust score based on piece ownership
        const pieceScore = piece.isWhite ? -value : value;
        
        // Add position bonus
        const positionBonus = positionValues[row][col];
        const adjustedPositionBonus = piece.isWhite ? -positionBonus : positionBonus;
        
        score += pieceScore + adjustedPositionBonus;
        
        // Calculate mobility (number of possible moves)
        const moves = calculatePossibleMoves(row, col, piece, board);
        const mobilityBonus = moves.length * 0.1;
        mobilityScore += piece.isWhite ? -mobilityBonus : mobilityBonus;
      }
    }
  }
  
  return score + mobilityScore;
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

// Minimax algorithm with alpha-beta pruning
function minimax(board: (ChessPiece | null)[][], depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean, difficulty: string): { score: number; move?: { from: { row: number; col: number }; to: { row: number; col: number } } } {
  // Base case: return evaluation if depth is 0
  if (depth === 0) {
    return { score: evaluatePosition(board) };
  }

  const possibleMoves = findAllPossibleMoves(board, !isMaximizingPlayer);
  
  // No moves available, game over
  if (possibleMoves.length === 0) {
    return { score: isMaximizingPlayer ? -1000 : 1000 };
  }

  // Add randomness based on difficulty
  const randomFactor = () => {
    if (difficulty === 'easy') return Math.random() * 3 - 1.5;
    if (difficulty === 'medium') return Math.random() * 1.5 - 0.75;
    return Math.random() * 0.5 - 0.25; // Hard: minimal randomness
  };

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    let bestMove;

    for (const move of possibleMoves) {
      const newBoard = makeMove(board, move.from, move.to);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, difficulty).score + randomFactor();
      
      if (evaluation > bestScore) {
        bestScore = evaluation;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove;

    for (const move of possibleMoves) {
      const newBoard = makeMove(board, move.from, move.to);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, difficulty).score + randomFactor();
      
      if (evaluation < bestScore) {
        bestScore = evaluation;
        bestMove = move;
      }
      
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return { score: bestScore, move: bestMove };
  }
}

export async function handleAIMove(
  board: (ChessPiece | null)[][],
  difficulty: string,
  setBoard: (board: (ChessPiece | null)[][]) => void,
  setMoveHistory: (updater: (prev: string[]) => string[]) => void,
  setGameOver: (over: boolean) => void,
  setIsThinking: (thinking: boolean) => void,
  setIsWhiteTurn: (isWhiteTurn: boolean) => void,
  onMoveMade?: (from: {row: number, col: number}, to: {row: number, col: number}) => void
): Promise<void> {
  setIsThinking(true);

  // Simulate AI thinking time based on difficulty
  const thinkingTime = {
    easy: 500,
    medium: 1200,
    hard: 1800
  }[difficulty] || 1200;

  await new Promise(resolve => setTimeout(resolve, thinkingTime));

  const possibleMoves = findAllPossibleMoves(board, false);
  
  if (possibleMoves.length === 0) {
    setGameOver(true);
    setIsThinking(false);
    toast.success("Échec et mat ! Vous avez gagné !");
    return;
  }

  let selectedMove;
  
  // Set search depth based on difficulty
  const searchDepth = {
    easy: 1,
    medium: 2,
    hard: 3
  }[difficulty] || 2;
  
  if (difficulty === 'easy' && Math.random() < 0.3) {
    // 30% chance of random move in easy mode
    selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    console.log("IA a choisi un coup aléatoire (mode facile)");
  } else {
    // Use minimax with alpha-beta pruning
    const result = minimax(board, searchDepth, -Infinity, Infinity, true, difficulty);
    selectedMove = result.move || possibleMoves[0];
    console.log(`IA a choisi un coup avec score: ${result.score}`);
  }

  const newBoard = makeMove(board, selectedMove.from, selectedMove.to);
  setBoard(newBoard);
  
  // Appeler le callback pour mettre à jour le surlignage du dernier mouvement
  if (onMoveMade) {
    onMoveMade(selectedMove.from, selectedMove.to);
  }
  
  const moveNotation = `${String.fromCharCode(97 + selectedMove.from.col)}${8 - selectedMove.from.row} → ${String.fromCharCode(97 + selectedMove.to.col)}${8 - selectedMove.to.row}`;
  setMoveHistory(prev => [...prev, moveNotation]);
  
  // Vérifier si le joueur est en échec et mat
  const isCheckmate = checkForCheckmate(newBoard, true);
  if (isCheckmate) {
    setGameOver(true);
    toast.error("Échec et mat ! L'IA a gagné !");
  }
  
  setIsWhiteTurn(true);
  setIsThinking(false);
}

// Fonction simplifiée pour détecter l'échec et mat
function checkForCheckmate(board: (ChessPiece | null)[][], isWhiteTurn: boolean): boolean {
  let hasLegalMove = false;
  
  for (let row = 0; row < 8 && !hasLegalMove; row++) {
    for (let col = 0; col < 8 && !hasLegalMove; col++) {
      const piece = board[row][col];
      if (piece && piece.isWhite === isWhiteTurn) {
        const moves = calculatePossibleMoves(row, col, piece, board);
        if (moves.length > 0) {
          hasLegalMove = true;
          break;
        }
      }
    }
  }
  
  return !hasLegalMove;
}
