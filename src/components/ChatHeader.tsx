import ThemeToggle from "@/components/ThemeToggle";
import fitglamLogo from "@/assets/fitglam-logo.png";

const ChatHeader = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border glass-surface">
      <div className="flex items-center gap-3">
        <img src={fitglamLogo} alt="FitGlam logo" className="h-9 w-auto" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-foreground">FitGlam</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
            AI Fashion Assistant
          </span>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
};

export default ChatHeader;
