
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MockSlotsAlert: React.FC = () => {
  return (
    <Alert variant="default" className="mb-4">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription>
        These are preview time slots. Actual booking will be confirmed by admin.
      </AlertDescription>
    </Alert>
  );
};

export default MockSlotsAlert;
