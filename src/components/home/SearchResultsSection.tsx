
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GroundCard from "@/components/grounds/GroundCard";
import { Ground } from "@/types/models";

interface SearchResultsSectionProps {
  searchTerm: string;
  filteredGrounds: Ground[];
  hasSearched: boolean;
}

const SearchResultsSection = ({ searchTerm, filteredGrounds, hasSearched }: SearchResultsSectionProps) => {
  const navigate = useNavigate();

  if (!hasSearched) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Search Results for "{searchTerm}"
        </h2>
        <Button
          variant="outline"
          onClick={() => navigate("/search", { state: { searchTerm } })}
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGrounds.map((ground) => (
          <GroundCard key={ground.id} ground={ground} />
        ))}
      </div>

      {filteredGrounds.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No grounds found for your search. Try a different term or browse all grounds.
          </p>
          <Button onClick={() => navigate("/search")}>Browse All Grounds</Button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsSection;
