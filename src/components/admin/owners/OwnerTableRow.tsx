
import React, { useState } from "react";
import { Edit, Trash, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteOwnerDialog from "./DeleteOwnerDialog";

interface OwnerTableRowProps {
  owner: any;
  owners: any[];
  onDeleteSuccess: (ownerId: string) => void;
}

const OwnerTableRow: React.FC<OwnerTableRowProps> = ({ 
  owner, 
  owners,
  onDeleteSuccess 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <TableRow key={owner.id}>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <div className="font-medium">{owner.name}</div>
            <div className="text-xs text-gray-500">ID: {owner.id}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>{owner.email}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <Phone className="h-4 w-4 text-gray-500" />
          <span>{owner.phone}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </DialogTrigger>
            <DeleteOwnerDialog
              ownerId={owner.id}
              owners={owners}
              onSuccess={onDeleteSuccess}
              onCancel={() => setIsDeleteDialogOpen(false)}
            />
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default OwnerTableRow;
