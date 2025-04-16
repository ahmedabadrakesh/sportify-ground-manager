
import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (status === "confirmed") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Confirmed
      </Badge>
    );
  } else if (status === "cancelled") {
    return (
      <Badge variant="destructive">
        <XCircle className="w-3.5 h-3.5 mr-1" /> Cancelled
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
        <Clock className="w-3.5 h-3.5 mr-1" /> Pending
      </Badge>
    );
  }
};
