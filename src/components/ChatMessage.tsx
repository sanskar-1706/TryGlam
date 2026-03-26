import ReactMarkdown from "react-markdown";
import { Sparkles, User } from "lucide-react";

export type Message = {
  role: "user" | "assistant";
  content: string;
  image?: string;
};

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-secondary"
            : "gold-gradient"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-surface-elevated text-foreground border border-border"
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="Generated"
            className="rounded-lg mb-2 max-w-full"
          />
        )}
        <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_p]:leading-relaxed text-sm">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
