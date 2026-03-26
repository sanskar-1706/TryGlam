import { useState, useCallback, useRef } from "react";
import { Upload, Image as ImageIcon, Sparkles, ArrowLeft, X, Clipboard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const TRYON_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/virtual-tryon`;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

interface ImageUploadZoneProps {
  label: string;
  icon: React.ReactNode;
  image: string | null;
  onImage: (dataUrl: string) => void;
  onClear: () => void;
}

const ImageUploadZone = ({ label, icon, image, onImage, onClear }: ImageUploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!isImageFile(file)) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    const dataUrl = await fileToBase64(file);
    onImage(dataUrl);
  }, [onImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) handleFile(file);
        return;
      }
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (image) {
    return (
      <div className="relative group rounded-2xl overflow-hidden border border-border bg-surface-elevated aspect-[3/4]">
        <img src={image} alt={label} className="w-full h-full object-cover" />
        <button
          onClick={onClear}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur border border-border text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-background/70 backdrop-blur text-xs text-muted-foreground">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onPaste={handlePaste}
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer aspect-[3/4] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border bg-surface-elevated hover:border-primary/50 hover:bg-primary/5"
      }`}
    >
      <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center px-4">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Drag & drop, paste, or click to upload
        </p>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clipboard className="w-3 h-3" />
        <span>Ctrl+V to paste</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

const VirtualTryOn = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTryOn = async () => {
    if (!personImage || !outfitImage) {
      toast.error("Please upload both images");
      return;
    }

    setIsProcessing(true);
    setResultImage(null);
    setResultText("");

    try {
      const resp = await fetch(TRYON_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ personImage, outfitImage }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 429) toast.error("Rate limited — try again in a moment");
        else if (resp.status === 402) toast.error("Credits exhausted — please add funds");
        else toast.error(err.error || "Try-on failed");
        return;
      }

      const data = await resp.json();
      setResultImage(data.imageUrl || null);
      setResultText(data.text || "");

      if (!data.imageUrl) {
        toast.error("Could not generate try-on image. Try different photos.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPersonImage(null);
    setOutfitImage(null);
    setResultImage(null);
    setResultText("");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border glass-surface">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Virtual Try-On</h1>
            <p className="text-xs text-muted-foreground">AI-powered outfit fitting</p>
          </div>
        </div>
        {(personImage || outfitImage || resultImage) && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
            Reset
          </Button>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Upload Section */}
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadZone
              label="Person Photo"
              icon={<Upload className="w-5 h-5 text-primary-foreground" />}
              image={personImage}
              onImage={setPersonImage}
              onClear={() => setPersonImage(null)}
            />
            <ImageUploadZone
              label="Outfit Image"
              icon={<ImageIcon className="w-5 h-5 text-primary-foreground" />}
              image={outfitImage}
              onImage={setOutfitImage}
              onClear={() => setOutfitImage(null)}
            />
          </div>

          {/* Try On Button */}
          <Button
            onClick={handleTryOn}
            disabled={!personImage || !outfitImage || isProcessing}
            className="w-full gold-gradient text-primary-foreground font-semibold py-6 text-base rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating try-on...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Try It On
              </span>
            )}
          </Button>

          {/* Result */}
          {(resultImage || isProcessing) && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Result
              </h2>
              {isProcessing ? (
                <div className="rounded-2xl border border-border bg-surface-elevated aspect-[3/4] flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">AI is fitting the outfit...</p>
                  </div>
                </div>
              ) : resultImage ? (
                <div className="rounded-2xl overflow-hidden border border-border bg-surface-elevated">
                  <img src={resultImage} alt="Try-on result" className="w-full" />
                  {resultText && (
                    <div className="p-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">{resultText}</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
