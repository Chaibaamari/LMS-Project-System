import { useState } from "react";

export const useTableControls = <T extends Record<string, unknown>>(
    initialData: T[],
    searchTerm: string,
    searchField: keyof T) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);
    const [columnFilters, setColumnFilters] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);

    const handleSort = (column: keyof T) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === column && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key: column, direction });
    };
    
    const applyColumnFilter = (column: keyof T, value: string) => {
        setColumnFilters((prev) => ({ ...prev, [column]: value }));
    };

    const clearColumnFilter = (column: keyof T) => {
        setColumnFilters((prev) => ({ ...prev, [column]: "" }));
    };

    const sortedAndFilteredData = initialData
        .filter((item) => {
            // Apply search filter
            const matchesSearch =
                searchTerm === "" ||
                String(item[searchField]).toLowerCase().includes(searchTerm.toLowerCase());

            // Apply column filters
            const matchesColumnFilters = Object.entries(columnFilters).every(([column, filterValue]) => {
                if (!filterValue) return true;
                return String(item[column]).toLowerCase().includes(filterValue.toLowerCase());
            });

            return matchesSearch && matchesColumnFilters;
        })
        .sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

    return {
        sortedAndFilteredData,
        sortConfig,
        columnFilters,
        handleSort,
        applyColumnFilter,
        clearColumnFilter,
    };
};