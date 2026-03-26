import { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage, { type Message } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import { streamChat, generateImage } from "@/lib/ai";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (input: string) => {
    const isImage = imageMode || input.startsWith("/image ");
    const cleanInput = input.startsWith("/image ") ? input.slice(7) : input;

    const userMsg: Message = { role: "user", content: cleanInput };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    if (isImage) {
      try {
        const result = await generateImage(cleanInput);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.text || "Here's your generated image!",
            image: result.imageUrl || undefined,
          },
        ]);
      } catch {
        // error toast already shown
      }
      setIsLoading(false);
    } else {
      let assistantSoFar = "";
      const allMessages = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

      await streamChat({
        messages: allMessages,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
              );
            }
            return [...prev, { role: "assistant", content: assistantSoFar }];
          });
        },
        onDone: () => setIsLoading(false),
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      {messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll p-4 space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
              </div>
              <div className="bg-surface-elevated border border-border rounded-2xl px-4 py-3">
                <span className="text-muted-foreground text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      )}
      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        imageMode={imageMode}
        onToggleImageMode={() => setImageMode(!imageMode)}
      />
    </div>
  );
};

export default Index;
