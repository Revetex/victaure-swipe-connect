
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useChessBoard } from "./useChessBoard";
import { useChessAI } from "./useChessAI";
import { getSquareName } from "./chessUtils";
import { useGamePersistence } from "./useGamePersistence";
import { getGameStatus, calculatePossibleMoves } from "./rules/chessRules";
import { GameState } from "./types/gameState";

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
  const { createGame, saveGameState, loadGame } = useGamePersistence();

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [gameStatus, setGameStatus] = useState(getGameStatus(board, true, false, null));

  useEffect(() => {
    const status = getGameStatus(board, isWhiteTurn, gameOver, gameStatus?.winner);
    setGameStatus(status);

    if (status.isCheckmate || status.isStalemate) {
      setGameOver(true);
      const message = status.isCheckmate 
        ? `Échec et mat ! Les ${status.winner === 'white' ? 'blancs' : 'noirs'} gagnent.`
        : 'Pat ! Match nul';
      toast.success(message);
    } else if (status.isCheck) {
      toast.info("Échec !");
    }
  }, [board, isWhiteTurn, gameOver, gameStatus?.winner]);

  const handleSquareClick = async (row: number, col: number) => {
    if (gameOver || (!isWhiteTurn && !selectedPiece)) return;

    const piece = board[row][col];

    if (selectedPiece) {
      const isPossibleMove = possibleMoves.some(move => move.row === row && move.col === col);
      if (isPossibleMove) {
        const currentPiece = board[selectedPiece.row][selectedPiece.col];
        if (!currentPiece) return;

        const newBoard = makeMove(selectedPiece.row, selectedPiece.col, row, col);
        if (!newBoard) return;

        const move = `${currentPiece.type} ${getSquareName(selectedPiece.row, selectedPiece.col)} → ${getSquareName(row, col)}`;
        setMoveHistory(prev => [...prev, move]);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setIsWhiteTurn(false);

        try {
          await createGame({
            board: newBoard,
            isWhiteTurn: false,
            moveHistory: [...moveHistory, move],
            winner: null
          });
          
          // AI's turn
          await makeAIMove(newBoard, difficulty, (from, to, aiBoard) => {
            if (!aiBoard) return;
            const aiPiece = aiBoard[from.row][from.col];
            if (!aiPiece) return;

            const aiMove = `${aiPiece.type} ${getSquareName(from.row, from.col)} → ${getSquareName(to.row, to.col)}`;
            setMoveHistory(prev => [...prev, aiMove]);
            setBoard(aiBoard);
            setIsWhiteTurn(true);
          });
        } catch (error) {
          console.error("Error during AI move:", error);
          toast.error("Erreur lors du coup de l'IA");
          setIsWhiteTurn(true);
        }
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
        
        if (piece && piece.isWhite === isWhiteTurn) {
          const moves = calculatePossibleMoves(row, col, piece, board);
          setSelectedPiece({ row, col });
          setPossibleMoves(moves);
        }
      }
    } else if (piece && piece.isWhite === isWhiteTurn) {
      const moves = calculatePossibleMoves(row, col, piece, board);
      setSelectedPiece({ row, col });
      setPossibleMoves(moves);
    }
  };

  const resetGame = () => {
    resetBoard();
    setIsWhiteTurn(true);
    setGameOver(false);
    setMoveHistory([]);
    setSelectedPiece(null);
    setPossibleMoves([]);
    setGameStatus(getGameStatus(board, true, false, null));
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
    gameStatus,
    handleSquareClick,
    resetGame,
    setDifficulty,
  };
}
