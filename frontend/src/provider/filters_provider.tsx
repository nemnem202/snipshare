import { createContext, useState } from "react";
import type { Filters } from "../types/general/explorerFilters";

export const FilterContext = createContext<{
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
} | null>(null);

export default function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>({ orderByPopularity: false, madeByUser: true });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>{children}</FilterContext.Provider>
  );
}
