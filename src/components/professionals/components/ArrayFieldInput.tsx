
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
}

export const ArrayFieldInput = ({ value = [], onChange, placeholder, label }: ArrayFieldInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
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
        <Button type="button" onClick={addItem} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {item}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeItem(index)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
