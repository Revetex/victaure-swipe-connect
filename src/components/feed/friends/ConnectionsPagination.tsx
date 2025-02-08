
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface ConnectionsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ConnectionsPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: ConnectionsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-3">
      <PaginationContent>
        {Array.from({ length: totalPages }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              className={cn(
                "transition-colors duration-200",
                currentPage === index + 1 && "bg-accent/50"
              )}
              isActive={currentPage === index + 1}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
