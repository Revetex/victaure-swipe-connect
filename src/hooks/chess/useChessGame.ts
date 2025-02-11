
import { useState, useEffect, useCallback } from "react";
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
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('chess_games')
        .insert({
          white_player_id: user.id,
          ai_difficulty: difficulty,
          game_state: serializeGameState(board, moveHistory, isWhiteTurn)
        })
        .select()
        .single();

      if (error) throw error;
      setGameId(data.id);
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error("Erreur lors de la création de la partie");
    }
  };

  const saveGameState = async () => {
    if (!gameId) return;

    try {
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
    createGame();
  }, []);

  useEffect(() => {
    if (board && moveHistory.length > 0) {
      saveGameState();
    }
  }, [board, moveHistory, isWhiteTurn, gameOver]);

  const handleSquareClick = async (row: number, col: number) => {
    if (gameOver || (!isWhiteTurn && !selectedPiece)) return;

    if (selectedPiece) {
      if (possibleMoves.some(move => move.row === row && move.col === col)) {
        const newBoard = makeMove(selectedPiece.row, selectedPiece.col, row, col);
        const move = `${getSquareName(selectedPiece.row, selectedPiece.col)} → ${getSquareName(row, col)}`;
        setMoveHistory(prev => [...prev, move]);
        setIsWhiteTurn(!isWhiteTurn);

        // AI's turn
        if (!gameOver && isWhiteTurn) {
          await makeAIMove(
            newBoard,
            difficulty,
            (from, to) => {
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
        }
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else {
      handlePieceSelect(row, col, isWhiteTurn);
    }
  };

  const resetGame = () => {
    resetBoard();
    setIsWhiteTurn(true);
    setGameOver(false);
    setMoveHistory([]);
    createGame();
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
