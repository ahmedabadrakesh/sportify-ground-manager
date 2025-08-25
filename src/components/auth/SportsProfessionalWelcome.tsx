import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Users, Trophy } from "lucide-react";

interface SportsProfessionalWelcomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartProfile: () => void;
  userName: string;
}

export const SportsProfessionalWelcome: React.FC<SportsProfessionalWelcomeProps> = ({
  open,
  onOpenChange,
  onStartProfile,
  userName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome, {userName}! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Let's Complete Your Sports Profile</h3>
            <p className="text-muted-foreground">
              Create a professional profile to showcase your expertise and attract clients
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-foreground">What you'll set up:</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm">Professional details & specialties</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm">Experience & achievements</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm">Pricing & availability</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              Takes 5-10 minutes
            </Badge>
            <Badge variant="outline" className="text-xs">
              Can be updated anytime
            </Badge>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="flex-1"
          >
            Skip for now
          </Button>
          <Button 
            onClick={onStartProfile} 
            className="flex-1"
          >
            Let's Start
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};