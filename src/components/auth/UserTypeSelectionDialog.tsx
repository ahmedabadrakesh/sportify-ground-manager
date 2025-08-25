import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface UserTypeSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserTypeSelect: (userType: "user" | "sports_professional") => void;
}

export const UserTypeSelectionDialog: React.FC<UserTypeSelectionDialogProps> = ({
  open,
  onOpenChange,
  onUserTypeSelect,
}) => {
  const [selectedUserType, setSelectedUserType] = useState<"user" | "sports_professional">("user");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Welcome to SportifyGround!</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            To personalize your experience, please tell us what type of user you are.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <RadioGroup
            value={selectedUserType}
            onValueChange={(value: "user" | "sports_professional") =>
              setSelectedUserType(value)
            }
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/5 cursor-pointer">
              <RadioGroupItem value="user" id="user-option" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="user-option" className="font-medium cursor-pointer">
                  Regular User
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Book sports grounds, join events, and connect with professionals
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/5 cursor-pointer">
              <RadioGroupItem 
                value="sports_professional" 
                id="professional-option" 
                className="mt-1" 
              />
              <div className="flex-1">
                <Label htmlFor="professional-option" className="font-medium cursor-pointer">
                  Sports Professional
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Coach, trainer, or instructor offering sports services
                </p>
              </div>
            </div>
          </RadioGroup>
          
          {selectedUserType === "sports_professional" && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-primary">
                <strong>Next:</strong> We'll help you create your professional profile to showcase your expertise and connect with potential clients.
              </p>
            </div>
          )}
        </div>
        
        <Button 
          onClick={() => onUserTypeSelect(selectedUserType)} 
          className="w-full"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};