
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ConnectionCard } from "./ConnectionCard";
import { Button } from "@/components/ui/button";
import { useConnections } from "./hooks/useConnections";

export function ConnectionsList() {
  const { connections, isLoading } = useConnections();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(connections.length / itemsPerPage);
  const paginatedConnections = connections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <div className="p-4">Loading connections...</div>;
  }

  if (!connections.length) {
    return <div className="p-4">No connections found.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {paginatedConnections.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
