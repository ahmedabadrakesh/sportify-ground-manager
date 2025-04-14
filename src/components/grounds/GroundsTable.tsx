
import React from "react";
import { Ground } from "@/types/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GroundTableRow from "./GroundTableRow";

interface GroundsTableProps {
  grounds: Ground[];
  isSuperAdmin: boolean;
  onDeleteGround: (groundId: string) => void;
}

const GroundsTable: React.FC<GroundsTableProps> = ({ 
  grounds, 
  isSuperAdmin,
  onDeleteGround
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ground Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Sports</TableHead>
              {isSuperAdmin && <TableHead>Owner</TableHead>}
              <TableHead>Facilities</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grounds.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isSuperAdmin ? 6 : 5}
                  className="text-center py-6 text-gray-500"
                >
                  No grounds found
                </TableCell>
              </TableRow>
            ) : (
              grounds.map((ground) => (
                <GroundTableRow 
                  key={ground.id}
                  ground={ground}
                  isSuperAdmin={isSuperAdmin}
                  onDelete={onDeleteGround}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GroundsTable;
