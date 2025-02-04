import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useNavigation() {
  const [currentPage, setCurrentPage] = useState(3);
  const [lastPageChange, setLastPageChange] = useState(Date.now());
  const navigate = useNavigate();
  const THROTTLE_DELAY = 300;

  const handlePageChange = useCallback((page: number) => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(page);
      setLastPageChange(now);
      
      if (page === 5) {
        navigate('/dashboard/tools');
      }
    }
  }, [lastPageChange, navigate]);

  return {
    currentPage,
    handlePageChange
  };
}