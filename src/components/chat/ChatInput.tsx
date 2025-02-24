
import { MessagesSquare, Mic, Volume2, Globe, Paperclip } from "lucide-react";

interface ChatInputProps {
  userInput: string;
  setUserInput: (input: string) => void;
  isRecording: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  disabledMessage?: string;
  onStartRecording: () => void;
  onStopSpeaking: () => void;
  onSendMessage: () => void;
  webSearchEnabled: boolean;
}

export function ChatInput({
  userInput,
  setUserInput,
  isRecording,
  isSpeaking,
  isLoading,
  isDisabled,
  disabledMessage,
  onStartRecording,
  onStopSpeaking,
  onSendMessage,
  webSearchEnabled
}: ChatInputProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserInput(`J'ai joint le fichier "${file.name}" pour analyse.`);
      // Le message sera envoyé avec le nom du fichier
    }
  };

  return (
    <div className="p-2 bg-[#1A1F2C]/90 border-t border-[#64B5D9]/10">
      <div className="flex items-center gap-2">
        <button
          onClick={onStartRecording}
          disabled={isRecording || isDisabled}
          className="h-8 w-8 flex-shrink-0 rounded-lg bg-[#2A2D3E] text-[#F1F0FB] hover:bg-[#363B4D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          title={isRecording ? "Enregistrement..." : "Enregistrer"}
        >
          <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder={isDisabled ? disabledMessage : "Message..."}
            disabled={isDisabled}
            className="w-full h-8 px-3 rounded-lg bg-[#2A2D3E] text-[#F1F0FB] text-sm border border-[#64B5D9]/20 focus:outline-none focus:border-[#64B5D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed placeholder-[#F1F0FB]/40"
            onKeyPress={e => e.key === 'Enter' && onSendMessage()}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <label className="cursor-pointer text-[#64B5D9] hover:text-[#64B5D9]/80 transition-colors">
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isDisabled}
                accept=".pdf,.doc,.docx,.txt"
              />
            </label>
            {webSearchEnabled && (
              <Globe className="w-4 h-4 text-[#64B5D9]" />
            )}
          </div>
        </div>

        <button
          onClick={onSendMessage}
          disabled={!userInput.trim() || isLoading || isDisabled}
          className="h-8 w-8 flex-shrink-0 rounded-lg bg-[#64B5D9] text-white hover:bg-[#64B5D9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <MessagesSquare className="w-4 h-4" />
        </button>

        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="h-8 w-8 flex-shrink-0 rounded-lg bg-[#64B5D9] text-white animate-pulse flex items-center justify-center"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
