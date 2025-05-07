import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EventsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const EventsPagination = ({ currentPage, totalPages, onPageChange }: EventsPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
            // Calculate the page number based on current page
            let pageNum = idx + 1;
            if (currentPage > 3 && totalPages > 5) {
              // If we're past page 3 and there are more than 5 pages,
              // shift the pagination window to keep current page in middle
              if (currentPage > totalPages - 2) {
                // Near the end
                pageNum = totalPages - 4 + idx;
              } else {
                // Middle
                pageNum = currentPage - 2 + idx;
              }
            }
            
            return (
              <PaginationItem key={idx}>
                <PaginationLink
                  isActive={pageNum === currentPage}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default EventsPagination;
