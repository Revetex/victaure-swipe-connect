
/**
 * Gestionnaire d'erreurs centralisé pour l'application
 */
import { toast } from "sonner";

// Types d'erreurs que l'application peut rencontrer
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  DATABASE = 'database',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

// Structure d'une erreur enrichie
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  code?: string;
  suggestion?: string;
}

// Fonction pour créer une erreur typée
export function createError(
  type: ErrorType,
  message: string,
  originalError?: any,
  code?: string,
  suggestion?: string
): AppError {
  return {
    type,
    message,
    originalError,
    code,
    suggestion
  };
}

// Fonction pour déterminer le type d'erreur basé sur un message ou code d'erreur
export function categorizeError(error: any): ErrorType {
  if (!error) return ErrorType.UNKNOWN;
  
  // Pour les erreurs de Supabase
  if (error.code) {
    if (error.code === 'PGRST116' || error.code === '42501') {
      return ErrorType.PERMISSION;
    }
    if (error.code === 'PGRST301') {
      return ErrorType.NOT_FOUND;
    }
    if (error.code === 'PGRST401' || error.code === '401') {
      return ErrorType.AUTH;
    }
    if (error.code.startsWith('PGRST')) {
      return ErrorType.DATABASE;
    }
    if (error.code === 'fetch_error' || error.code === 'network_error') {
      return ErrorType.NETWORK;
    }
    if (error.code === '23505') {
      return ErrorType.VALIDATION; // Violation de contrainte d'unicité
    }
    if (error.code.startsWith('22') || error.code.startsWith('23')) {
      return ErrorType.VALIDATION; // Erreurs de validation PostgreSQL
    }
    if (error.code.startsWith('50')) {
      return ErrorType.SERVER; // Erreurs internes PostgreSQL
    }
  }

  // Pour les erreurs standard
  if (error.name === 'NetworkError' || error.message?.includes('network')) {
    return ErrorType.NETWORK;
  }
  if (error.name === 'AuthError' || error.message?.includes('auth') || 
      error.message?.includes('token') || error.message?.includes('permission')) {
    return ErrorType.AUTH;
  }
  
  return ErrorType.UNKNOWN;
}

// Fonction de traitement centralisé des erreurs
export function handleError(error: any, showToast = true): AppError {
  console.error("[Error Handler]", error);
  
  const errorType = categorizeError(error);
  let message = "Une erreur s'est produite";
  let suggestion = "Veuillez réessayer plus tard";
  let code = error.code || 'unknown';
  
  switch (errorType) {
    case ErrorType.NETWORK:
      message = "Erreur de connexion";
      suggestion = "Veuillez vérifier votre connexion Internet";
      break;
    case ErrorType.AUTH:
      message = "Erreur d'authentification";
      suggestion = "Veuillez vous reconnecter";
      break;
    case ErrorType.DATABASE:
      message = "Erreur de base de données";
      suggestion = "Si le problème persiste, contactez le support";
      break;
    case ErrorType.VALIDATION:
      message = "Données invalides";
      suggestion = "Veuillez vérifier les informations saisies";
      break;
    case ErrorType.PERMISSION:
      message = "Accès refusé";
      suggestion = "Vous n'avez pas les permissions nécessaires";
      break;
    case ErrorType.NOT_FOUND:
      message = "Ressource introuvable";
      suggestion = "La ressource demandée n'existe pas ou a été supprimée";
      break;
    case ErrorType.SERVER:
      message = "Erreur serveur";
      suggestion = "Nos serveurs rencontrent un problème. Veuillez réessayer plus tard";
      break;
    case ErrorType.UNKNOWN:
    default:
      if (error.message) {
        message = error.message;
      }
      break;
  }
  
  // Montrer un toast d'erreur si nécessaire
  if (showToast) {
    toast.error(message, {
      description: suggestion,
      duration: 5000
    });
  }
  
  return createError(errorType, message, error, code, suggestion);
}
