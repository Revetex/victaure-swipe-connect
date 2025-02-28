
import { useState, useEffect } from "react";
import { ChessPiece } from "@/types/chess";
import { initializeBoard, getSquareName } from "@/components/tools/chess/utils/boardUtils";
import { calculatePossibleMoves } from "@/components/tools/chess/utils/moveCalculator";
import { handleAIMove } from "@/components/tools/chess/utils/aiHandler";
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
  const [lastMoveHighlight, setLastMoveHighlight] = useState<{from: {row: number, col: number}, to: {row: number, col: number}} | null>(null);
  
  // Récupérer les paramètres de difficulté si disponibles dans l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const diffParam = urlParams.get('difficulty');
    if (diffParam && ['easy', 'medium', 'hard'].includes(diffParam)) {
      setDifficulty(diffParam);
      toast.info(`Difficulté définie sur ${diffParam}`);
    }
  }, []);
  
  const handleSquareClick = async (row: number, col: number) => {
    if (gameOver || (!isWhiteTurn && !selectedPiece)) return;

    const piece = board[row][col];

    if (selectedPiece) {
      if (possibleMoves.some(move => move.row === row && move.col === col)) {
        const newBoard = [...board.map(row => [...row])];
        newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        
        // Enregistrer le dernier mouvement pour le surlignage
        setLastMoveHighlight({
          from: { row: selectedPiece.row, col: selectedPiece.col },
          to: { row, col }
        });
        
        const move = `${getSquareName(selectedPiece.row, selectedPiece.col)} → ${getSquareName(row, col)}`;
        const newMoveHistory = [...moveHistory, move];
        setMoveHistory(newMoveHistory);
        
        setBoard(newBoard);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setIsWhiteTurn(!isWhiteTurn);

        // Détection de l'échec et mat
        const isCheckmate = checkForCheckmate(newBoard, !isWhiteTurn);
        if (isCheckmate) {
          setGameOver(true);
          toast.success(`Échec et mat ! ${isWhiteTurn ? 'Blancs' : 'Noirs'} gagnent !`);
          return;
        }

        // AI's turn
        if (!gameOver && isWhiteTurn) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await handleAIMove(
                newBoard,
                difficulty,
                setBoard,
                setMoveHistory,
                setGameOver,
                setIsThinking,
                setIsWhiteTurn,
                (from, to) => {
                  setLastMoveHighlight({ from, to });
                }
              );
            }
          } catch (error) {
            console.error("Error during AI move:", error);
            setIsWhiteTurn(true);
            toast.error("Erreur lors du mouvement de l'IA");
          }
        }
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else if (piece && piece.isWhite === isWhiteTurn) {
      setSelectedPiece({ row, col });
      const moves = calculatePossibleMoves(row, col, piece, board);
      setPossibleMoves(moves);
    }
  };

  // Fonction simplifiée pour détecter l'échec et mat (à implémenter complètement)
  const checkForCheckmate = (board: (ChessPiece | null)[][], isWhiteTurn: boolean) => {
    // Cette fonction devrait parcourir toutes les pièces du joueur actuel
    // et vérifier si au moins une pièce a un mouvement légal
    // Si aucune pièce n'a de mouvement légal, c'est échec et mat
    
    // Pour maintenir la simplicité, nous utilisons une implémentation basique
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
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setPossibleMoves([]);
    setIsWhiteTurn(true);
    setGameOver(false);
    setMoveHistory([]);
    setLastMoveHighlight(null);
    toast.info("Nouvelle partie commencée !");
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
    lastMoveHighlight,
    handleSquareClick,
    resetGame,
    setDifficulty,
  };
}
