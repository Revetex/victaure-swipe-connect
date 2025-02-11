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

  const checkForKing = (currentBoard: (ChessPiece | null)[][]): boolean => {
    let blackKingFound = false;
    let whiteKingFound = false;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col];
        if (piece?.type === 'king') {
          if (piece.isWhite) {
            whiteKingFound = true;
          } else {
            blackKingFound = true;
          }
        }
      }
    }

    if (!blackKingFound) {
      toast.success("Félicitations ! Vous avez gagné en capturant le roi noir !");
      return true;
    }
    if (!whiteKingFound) {
      toast.success("L'IA a gagné en capturant votre roi !");
      return true;
    }

    return false;
  };

  const createGame = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
      setGameId(data.id);
    } catch (error) {
      console.error('Error creating game:', error);
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
    }
  };

  useEffect(() => {
    if (!gameId) {
      createGame();
    }
  }, []);

  useEffect(() => {
    if (gameId && board && moveHistory.length > 0) {
      saveGameState();
    }
  }, [board, moveHistory, isWhiteTurn, gameOver]);

  const handleSquareClick = async (row: number, col: number) => {
    if (gameOver || (!isWhiteTurn && !selectedPiece)) return;

    if (selectedPiece) {
      if (possibleMoves.some(move => move.row === row && move.col === col)) {
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = newBoard[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        
        setBoard(newBoard);
        
        const move = `${getSquareName(selectedPiece.row, selectedPiece.col)} → ${getSquareName(row, col)}`;
        setMoveHistory(prev => [...prev, move]);
        setSelectedPiece(null);
        setPossibleMoves([]);

        if (checkForKing(newBoard)) {
          setGameOver(true);
          return;
        }

        setIsWhiteTurn(false);

        try {
          await makeAIMove(
            newBoard,
            difficulty,
            (from, to) => {
              const aiBoard = newBoard.map(row => [...row]);
              aiBoard[to.row][to.col] = aiBoard[from.row][from.col];
              aiBoard[from.row][from.col] = null;
              
              const aiMove = `${getSquareName(from.row, from.col)} → ${getSquareName(to.row, to.col)}`;
              setMoveHistory(prev => [...prev, aiMove]);
              setBoard(aiBoard);

              if (checkForKing(aiBoard)) {
                setGameOver(true);
                return;
              }

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
          setIsWhiteTurn(true);
        }
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
        
        const piece = board[row][col];
        if (piece && piece.isWhite === isWhiteTurn) {
          handlePieceSelect(row, col, isWhiteTurn);
        }
      }
    } else {
      const piece = board[row][col];
      if (piece && piece.isWhite === isWhiteTurn) {
        handlePieceSelect(row, col, isWhiteTurn);
      }
    }
  };

  const resetGame = () => {
    resetBoard();
    setIsWhiteTurn(true);
    setGameOver(false);
    setMoveHistory([]);
    setGameId(null);
    setSelectedPiece(null);
    setPossibleMoves([]);
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
