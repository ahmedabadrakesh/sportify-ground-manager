
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash, MapPin, User, Grid3X3 } from "lucide-react";
import { Ground } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GroundTableRowProps {
  ground: Ground;
  isSuperAdmin: boolean;
  onDelete: (groundId: string) => void;
}

interface Game {
  id: string;
  name: string;
}

const GroundTableRow: React.FC<GroundTableRowProps> = ({ 
  ground, 
  isSuperAdmin,
  onDelete 
}) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [allGames, setAllGames] = useState<Game[]>([]);

  useEffect(() => {
    // Fetch all games from the 'games' table once
    const fetchGames = async () => {
      const { data, error } = await supabase.from("games").select("id, name");
      if (!error && data) {
        setAllGames(data);
      }
    };
    fetchGames();
  }, []);

  // Get the names of selected games for this ground
  const getGameNames = () => {
    if (!Array.isArray(ground.games) || allGames.length === 0) return [];
    return ground.games
      .map((gameId) => {
        const gameObj = allGames.find((g) => g.id === gameId);
        return gameObj ? gameObj.name : gameId;
      })
      .filter(Boolean);
  };

  // Function to get the correct image path for display
  const getDisplayImagePath = (imagePath: string) => {
    return imagePath.startsWith("public/") ? imagePath.substring(7) : imagePath;
  };

  const handleDelete = () => {
    onDelete(ground.id);
    setIsDeleteDialogOpen(false);
    toast.success(`Ground "${ground.name}" deleted successfully`);
  };

  return (
    <TableRow key={ground.id}>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
            <img
              src={getDisplayImagePath(ground.images[0] || "/placeholder.svg")}
              alt={ground.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{ground.name}</div>
            <div className="text-xs text-gray-500">ID: {ground.id}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{ground.address}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {getGameNames().length > 0
            ? getGameNames().map((gameName) => (
                <Badge key={gameName} variant="outline" className="text-xs">
                  {gameName}
                </Badge>
              ))
            : (
                <span className="text-xs text-gray-500">No games selected</span>
              )
          }
        </div>
      </TableCell>
      {isSuperAdmin && (
        <TableCell>
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{ground.ownerName}</span>
          </div>
        </TableCell>
      )}
      <TableCell>
        <div className="flex items-center space-x-1">
          <Grid3X3 className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {ground.facilities.length} facilities
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => navigate(`/admin/grounds/edit/${ground.id}`)}
          >
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Ground</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this ground? This action
                  cannot be undone and all associated bookings will be
                  cancelled.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default GroundTableRow;
