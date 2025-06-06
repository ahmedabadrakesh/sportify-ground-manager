
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLabel } from "@/components/ui/form";

interface MultiSelectFieldProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  icon?: React.ReactNode;
}

export const MultiSelectField = ({ options, value = [], onChange, label, icon }: MultiSelectFieldProps) => {
  const handleToggle = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(item => item !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      <FormLabel className="flex items-center gap-2">
        {icon}
        {label}
      </FormLabel>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={value.includes(option)}
              onCheckedChange={() => handleToggle(option)}
            />
            <label
              htmlFor={option}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
