import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface ArrayFieldInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  label: string;
  type?: string;
}

export const ArrayFieldInput = ({
  value = [],
  onChange,
  placeholder,
  label,
  type = "non known",
}: ArrayFieldInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue || value.includes(trimmedValue)) {
      return;
    }

    // Validate image URLs when type is "image"
    if (type === "image") {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.tiff'];
      const hasValidExtension = imageExtensions.some(ext => 
        trimmedValue.toLowerCase().endsWith(ext)
      );
      
      if (!hasValidExtension) {
        alert("Please enter a valid image URL ending with: " + imageExtensions.join(', '));
        return;
      }
    }

    onChange([...value, trimmedValue]);
    setInputValue("");
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
        />
        <Button type="button" variant="secondary" onClick={addItem} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {value.map((item, index) => (
          <>
            {type === "image" ? (
              <>
                <img src={item} className="w-12 h-12" />
                <X
                  className="h-3 w-3 cursor-pointer relative -top-2 right-1 "
                  onClick={() => removeItem(index)}
                />
              </>
            ) : (
              <>
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {item}
                  <X
                    className="h-3 w-3 cursor-pointer "
                    onClick={() => removeItem(index)}
                  />
                </Badge>
              </>
            )}
          </>
        ))}
      </div>
    </div>
  );
};
