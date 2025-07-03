import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ClipboardPaste, Copy } from "lucide-react";
import { toast } from "sonner";

interface TextSuggestionCarouselProps {
  suggestions: string[];
  className?: string;
  setSuggestedPunchLine: any;
}

const TextSuggestionCarousel = ({
  suggestions,
  className = "",
  setSuggestedPunchLine,
}: TextSuggestionCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? suggestions.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(suggestions[currentIndex]);
    toast.success("The suggestion has been copied to your clipboard.");
    setSuggestedPunchLine(suggestions[currentIndex]);
  };

  return (
    <div className={`flex items-center gap-3 mt-1 w-84 ${className}`}>
      <button
        onClick={goToPrevious}
        className="flex items-center justify-center w-4 h-4 rounded-full  hover:bg-accent transition-colors duration-200"
        aria-label="Previous suggestion"
      >
        <ArrowLeft className="w-4 h-4 text-foreground" />
      </button>

      <div className="flex-1 min-w-0">
        <button
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center gap-2 text-foreground text-center px-3 py-2 rounded hover:bg-accent transition-colors duration-200 cursor-pointer"
          title="Click to copy to clipboard"
        >
          <span className="truncate flex-1 text-xs ">
            {suggestions[currentIndex]}
          </span>
          <ClipboardPaste className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </div>

      <button
        onClick={goToNext}
        className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-accent transition-colors duration-200"
        aria-label="Next suggestion"
      >
        <ArrowRight className="w-4 h-4 text-foreground" />
      </button>
    </div>
  );
};

export default TextSuggestionCarousel;
