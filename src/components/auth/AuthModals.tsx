import { X } from "lucide-react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AuthModal({ show, onClose, title, children }: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div className="prose prose-sm dark:prose-invert">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}