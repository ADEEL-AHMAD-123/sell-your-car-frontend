// utils/useStableDebouncedFilters.js
import { useEffect, useState, useRef } from 'react';

export const useStableDebouncedFilters = (filters, delay = 500) => {
  const [debounced, setDebounced] = useState(filters);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (JSON.stringify(filters) === JSON.stringify(debounced)) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDebounced(filters);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [filters, debounced, delay]);

  return debounced;
};
