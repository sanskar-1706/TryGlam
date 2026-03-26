import { Sparkles } from "lucide-react";

const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        Welcome to PixelForge
      </h2>
      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
        Chat with me or toggle image mode (🖼️) to generate images. You can also
        type <code className="bg-secondary px-1.5 py-0.5 rounded text-xs text-foreground">/image</code>{" "}
        before your prompt.
      </p>
    </div>
  );
};

export default WelcomeScreen;
