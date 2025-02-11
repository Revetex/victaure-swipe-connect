
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useChessBoard } from "./useChessBoard";
import { useChessAI } from "./useChessAI";
import { getSquareName } from "./chessUtils";
import { ChessPiece } from "@/types/chess";
import { Json } from "@/integrations/supabase/types";

export function useChessGame() {
  const {
    board,
    selectedPiece,
    possibleMoves,
    handlePieceSelect,
    makeMove,
    resetBoard,
    setBoard,
    setPossibleMoves,
    setSelectedPiece
  } = useChessBoard();
  
  const { isThinking, makeAIMove } = useChessAI();
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [gameId, setGameId] = useState<string | null>(null);

  const serializeGameState = (
    board: (ChessPiece | null)[][], 
    moveHistory: string[], 
    isWhiteTurn: boolean
  ): Json => {
    return {
      board: board.map(row => 
        row.map(piece => 
          piece ? {
            type: piece.type,
            isWhite: piece.isWhite
          } : null
        )
      ),
      moveHistory,
      isWhiteTurn
    } as Json;
  };

  const createGame = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("User not authenticated, skipping game creation");
        return;
      }

      const { data, error } = await supabase
        .from('chess_games')
        .insert({
          white_player_id: user.id,
          ai_difficulty: difficulty,
          game_state: serializeGameState(board, moveHistory, isWhiteTurn),
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;
      console.log("Created new game:", data.id);
      setGameId(data.id);
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error("Erreur lors de la création de la partie");
    }
  };

  const saveGameState = async () => {
    if (!gameId) {
      console.log("No game ID, skipping save");
      return;
    }

    try {
      console.log("Saving game state for game:", gameId);
      const { error } = await supabase
        .from('chess_games')
        .update({
          game_state: serializeGameState(board, moveHistory, isWhiteTurn),
          status: gameOver ? 'completed' : 'in_progress'
        })
        .eq('id', gameId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving game state:', error);
      toast.error("Erreur lors de la sauvegarde de la partie");
    }
  };

  useEffect(() => {
    if (!gameId) {
      console.log("No game ID, creating new game");
      createGame();
    }
  }, []);

  useEffect(() => {
    if (gameId && board && moveHistory.length > 0) {
      console.log("Saving game state...");
      saveGameState();
    }
  }, [board, moveHistory, isWhiteTurn, gameOver]);

  const handleSquareClick = async (row: number, col: number) => {
    if (gameOver || (!isWhiteTurn && !selectedPiece)) {
      console.log("Move blocked - game over or not player's turn");
      return;
    }

    if (selectedPiece) {
      if (possibleMoves.some(move => move.row === row && move.col === col)) {
        console.log("Making move:", selectedPiece, "to", row, col);
        const newBoard = makeMove(selectedPiece.row, selectedPiece.col, row, col);
        const move = `${getSquareName(selectedPiece.row, selectedPiece.col)} → ${getSquareName(row, col)}`;
        setMoveHistory(prev => [...prev, move]);
        setIsWhiteTurn(!isWhiteTurn);

        // AI's turn
        if (!gameOver && isWhiteTurn) {
          try {
            console.log("Initiating AI move...");
            await makeAIMove(
              newBoard,
              difficulty,
              (from, to) => {
                console.log("AI moving from", from, "to", to);
                const aiBoard = makeMove(from.row, from.col, to.row, to.col);
                const aiMove = `${getSquareName(from.row, from.col)} → ${getSquareName(to.row, to.col)}`;
                setMoveHistory(prev => [...prev, aiMove]);
                setBoard(aiBoard);
                setIsWhiteTurn(true);
              },
              () => {
                setGameOver(true);
                toast.success("Échec et mat ! Partie terminée");
              }
            );
          } catch (error) {
            console.error("Error during AI move:", error);
            toast.error("Erreur lors du coup de l'IA");
          }
        }
      } else {
        console.log("Invalid move - deselecting piece");
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else {
      const piece = board[row][col];
      if (piece && piece.isWhite === isWhiteTurn) {
        console.log("Selecting piece at", row, col);
        handlePieceSelect(row, col, isWhiteTurn);
      }
    }
  };

  const resetGame = () => {
    console.log("Resetting game...");
    resetBoard();
    setIsWhiteTurn(true);
    setGameOver(false);
    setMoveHistory([]);
    setGameId(null);
    createGame();
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
