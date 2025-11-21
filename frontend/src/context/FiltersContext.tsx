import { createContext, useContext, useState, ReactNode } from 'react';
import { GlobalFilters } from '../types/filters';

interface FiltersContextType {
  filters: GlobalFilters;
  setFilters: (filters: GlobalFilters) => void;
  updateFilter: (key: keyof GlobalFilters, value: string | "any") => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GlobalFilters>({
    brand: "any",
    owner: "any",
    franchiseId: "any",
    storeId: "ST001",
    channel: "any",
    engagementMode: "any",
    callDate: {
      operator: "is_previous",
      quantity: 1,
      unit: "days",
    },
  });

  const updateFilter = (key: keyof GlobalFilters, value: string | "any") => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <FiltersContext.Provider value={{ filters, setFilters, updateFilter }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}

