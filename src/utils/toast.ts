import { toast } from "sonner";

export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
  info: (message: string) => {
    toast.info(message);
  },
  warning: (message: string) => {
    toast.warning(message);
  },
};

export const commonToasts = {
  errorOccurred: () => showToast.error("Une erreur est survenue"),
  notAuthenticated: () => showToast.error("Vous devez être connecté pour effectuer cette action"),
  actionSuccess: (action: string) => showToast.success(`${action} effectué avec succès`),
  actionFailed: (action: string) => showToast.error(`Erreur lors de ${action}`),
  invalidInput: () => showToast.error("Veuillez vérifier vos entrées"),
  saved: () => showToast.success("Modifications enregistrées"),
  deleted: () => showToast.success("Suppression effectuée"),
  updated: () => showToast.success("Mise à jour effectuée"),
};