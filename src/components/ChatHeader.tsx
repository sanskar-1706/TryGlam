import { Sparkles, Shirt } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ChatHeader = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border glass-surface">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-foreground">FitGlam</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
            AI Fashion Assistant
          </span>
        </div>
      </div>
      <Link to="/virtual-tryon">
        <Button variant="outline" size="sm" className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
          <Shirt className="w-4 h-4" />
          Try On
        </Button>
      </Link>
    </header>
  );
};

export default ChatHeader;
