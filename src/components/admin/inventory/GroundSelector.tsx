
import React from "react";
import { Ground } from "@/types/models";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GroundSelectorProps {
  grounds: Ground[];
  selectedGround: string;
  setSelectedGround: (groundId: string) => void;
}

const GroundSelector: React.FC<GroundSelectorProps> = ({
  grounds,
  selectedGround,
  setSelectedGround
}) => {
  return (
    <div className="mb-4">
      <Select
        value={selectedGround}
        onValueChange={setSelectedGround}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a ground" />
        </SelectTrigger>
        <SelectContent>
          {grounds.map((ground) => (
            <SelectItem key={ground.id} value={ground.id}>
              {ground.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GroundSelector;
