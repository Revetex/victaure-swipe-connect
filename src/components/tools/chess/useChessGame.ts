
import { useState, useCallback } from "react";
import { ChessPiece } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useChessGame() {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [possibleMoves, setPossibleMoves] = useState<{row: number, col: number}[]>([]);
  const [difficulty, setDifficulty] = useState<string>("medium");

  function initializeBoard() {
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

  const getSquareName = (row: number, col: number) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return `${files[col]}${8 - row}`;
  };

  const calculatePossibleMoves = useCallback((fromRow: number, fromCol: number, piece: ChessPiece) => {
    const moves: {row: number, col: number}[] = [];
    
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

        // Forward move
        if (!board[fromRow + direction]?.[fromCol]) {
          addMove(fromRow + direction, fromCol);
          // Double move from starting position
          if (fromRow === startRow && !board[fromRow + 2 * direction]?.[fromCol]) {
            addMove(fromRow + 2 * direction, fromCol);
          }
        }

        // Captures
        for (const captureCol of [fromCol - 1, fromCol + 1]) {
          if (isValidPosition(fromRow + direction, captureCol)) {
            const target = board[fromRow + direction][captureCol];
            if (target && target.isWhite !== piece.isWhite) {
              addMove(fromRow + direction, captureCol);
            }
          }
        }
        break;
      }

      case 'rook': {
        // Horizontal and vertical moves
        for (let i = 0; i < 8; i++) {
          if (i !== fromCol && isPathClear(fromRow, fromCol, fromRow, i)) addMove(fromRow, i);
          if (i !== fromRow && isPathClear(fromRow, fromCol, i, fromCol)) addMove(i, fromCol);
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
        // Diagonal moves
        for (let i = 1; i < 8; i++) {
          for (const [rowDir, colDir] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
            const newRow = fromRow + i * rowDir;
            const newCol = fromCol + i * colDir;
            if (isValidPosition(newRow, newCol) && isPathClear(fromRow, fromCol, newRow, newCol)) {
              addMove(newRow, newCol);
            }
          }
        }
        break;
      }

      case 'queen': {
        // Combine rook and bishop moves
        for (let i = 0; i < 8; i++) {
          if (i !== fromCol && isPathClear(fromRow, fromCol, fromRow, i)) addMove(fromRow, i);
          if (i !== fromRow && isPathClear(fromRow, fromCol, i, fromCol)) addMove(i, fromCol);
        }
        for (let i = 1; i < 8; i++) {
          for (const [rowDir, colDir] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
            const newRow = fromRow + i * rowDir;
            const newCol = fromCol + i * colDir;
            if (isValidPosition(newRow, newCol) && isPathClear(fromRow, fromCol, newRow, newCol)) {
              addMove(newRow, newCol);
            }
          }
        }
        break;
      }

      case 'king': {
        // All adjacent squares
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
          for (let colOffset = -1; colOffset <= 1; colOffset++) {
            if (rowOffset === 0 && colOffset === 0) continue;
            addMove(fromRow + rowOffset, fromCol + colOffset);
          }
        }
        break;
      }
    }
    
    return moves;
  }, [board]);

  const handleSquareClick = async (row: number, col: number) => {
    if (gameOver || (!isWhiteTurn && !selectedPiece)) return;

    const piece = board[row][col];

    if (selectedPiece) {
      if (possibleMoves.some(move => move.row === row && move.col === col)) {
        const newBoard = [...board];
        newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        
        const move = `${getSquareName(selectedPiece.row, selectedPiece.col)} → ${getSquareName(row, col)}`;
        setMoveHistory([...moveHistory, move]);
        
        setBoard(newBoard);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setIsWhiteTurn(!isWhiteTurn);

        // AI's turn
        if (!gameOver && isWhiteTurn) {
          setIsThinking(true);
          try {
            const { data, error } = await supabase.functions.invoke('chess-ai-move', {
              body: { 
                board: newBoard,
                difficulty: difficulty
              }
            });

            if (error) throw error;

            if (data.move) {
              const { from, to } = data.move;
              const aiMove = `${getSquareName(from.row, from.col)} → ${getSquareName(to.row, to.col)}`;
              setMoveHistory(prev => [...prev, aiMove]);
              
              const aiBoard = [...newBoard];
              aiBoard[to.row][to.col] = aiBoard[from.row][from.col];
              aiBoard[from.row][from.col] = null;
              setBoard(aiBoard);
            }

            if (data.gameOver) {
              setGameOver(true);
              toast.success("Échec et mat ! Partie terminée");
            }
          } catch (error) {
            console.error('AI move error:', error);
            toast.error("Erreur lors du coup de l'IA");
          } finally {
            setIsThinking(false);
            setIsWhiteTurn(true);
          }
        }
      } else {
        toast.error("Coup invalide");
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else if (piece && piece.isWhite === isWhiteTurn) {
      setSelectedPiece({ row, col });
      const moves = calculatePossibleMoves(row, col, piece);
      setPossibleMoves(moves);
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setPossibleMoves([]);
    setIsWhiteTurn(true);
    setGameOver(false);
    setMoveHistory([]);
    toast.success("Nouvelle partie commencée");
  };

  return {
    board,
    selectedPiece,
    isWhiteTurn,
    isThinking,
    gameOver,
    moveHistory,
    possibleMoves,
    difficulty,
    handleSquareClick,
    resetGame,
    setDifficulty,
  };
}
