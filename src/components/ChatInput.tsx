import { useState } from "react";
import { Send, Image } from "lucide-react";

type ChatInputProps = {
  onSend: (message: string) => void;
  isLoading: boolean;
  imageMode: boolean;
  onToggleImageMode: () => void;
};

const ChatInput = ({ onSend, isLoading, imageMode, onToggleImageMode }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleImageMode}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            imageMode
              ? "gold-gradient text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
          title="Toggle image mode"
        >
          <Image className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-secondary text-foreground placeholder:text-muted-foreground rounded-full px-4 py-2.5 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-ring"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-full flex items-center justify-center gold-gradient text-primary-foreground disabled:opacity-40 transition-opacity"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
