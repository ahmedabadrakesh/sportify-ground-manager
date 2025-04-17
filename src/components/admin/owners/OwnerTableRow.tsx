
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteOwnerDialog from "./DeleteOwnerDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditOwnerForm from "./EditOwnerForm";
import { Pencil, Trash } from "lucide-react";

interface OwnerTableRowProps {
  owner: any;
  onDeleteOwner: (ownerId: string) => void;
  onEditOwner: (owner: any) => void;
}

const OwnerTableRow: React.FC<OwnerTableRowProps> = ({ 
  owner, 
  onDeleteOwner,
  onEditOwner 
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeleteConfirm = () => {
    onDeleteOwner(owner.id);
    setIsDeleteOpen(false);
  };

  const handleEditSuccess = (updatedOwner: any) => {
    onEditOwner(updatedOwner);
    setIsEditOpen(false);
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{owner.name}</TableCell>
        <TableCell>{owner.email}</TableCell>
        <TableCell>{owner.phone || "—"}</TableCell>
        <TableCell>{owner.whatsapp || "—"}</TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <DeleteOwnerDialog
        isOpen={isDeleteOpen}
        ownerName={owner.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Ground Owner</DialogTitle>
          </DialogHeader>
          <EditOwnerForm
            ownerId={owner.id}
            ownerData={owner}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OwnerTableRow;
