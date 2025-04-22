
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, 
  AlertDialogAction } from "@/components/ui/alert-dialog";
import { Ground } from "@/types/models";
import { edit, trash2 } from "lucide-react";
import EditGroundDialog from "../admin/grounds/EditGroundDialog";

interface GroundTableRowProps {
  ground: Ground;
  isSuperAdmin: boolean;
  onDelete: (id: string) => void;
}

const GroundTableRow = ({ ground, isSuperAdmin, onDelete }: GroundTableRowProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>{ground.name}</TableCell>
        <TableCell>{ground.address}</TableCell>
        <TableCell>{ground.games?.join(", ")}</TableCell>
        {isSuperAdmin && <TableCell>{ground.ownerName}</TableCell>}
        <TableCell>{ground.facilities?.join(", ")}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowEditDialog(true)}
            >
              <edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ground
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(ground.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showEditDialog && (
        <EditGroundDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          ground={ground}
          owners={[]} // This will be populated from parent component
          isSuperAdmin={isSuperAdmin}
        />
      )}
    </>
  );
};

export default GroundTableRow;
