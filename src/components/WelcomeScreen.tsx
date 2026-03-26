import fitglamLogo from "@/assets/fitglam-logo.png";

const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <img src={fitglamLogo} alt="FitGlam" className="w-28 h-auto mb-6" />
      <h2 className="text-2xl font-bold text-foreground mb-3">
        Welcome to FitGlam
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
