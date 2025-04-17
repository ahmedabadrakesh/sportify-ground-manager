
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OwnerTableRow from "./OwnerTableRow";

interface OwnerTableProps {
  owners: any[];
  onDeleteOwner: (ownerId: string) => void;
  onEditOwner: (owner: any) => void;
}

const OwnerTable: React.FC<OwnerTableProps> = ({ 
  owners, 
  onDeleteOwner,
  onEditOwner
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {owners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No ground owners found
              </TableCell>
            </TableRow>
          ) : (
            owners.map((owner) => (
              <OwnerTableRow 
                key={owner.id} 
                owner={owner} 
                onDeleteOwner={onDeleteOwner}
                onEditOwner={onEditOwner}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OwnerTable;
