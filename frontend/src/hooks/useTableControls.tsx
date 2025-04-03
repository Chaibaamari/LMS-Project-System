// import { useMemo, useState } from "react";

// export const useTableControls = <T extends Record<string, unknown>>(
//     initialData: T[],
//     searchTerm: string,
//     searchField: keyof T
// ) => {
//     const [sortConfig, setSortConfig] = useState<{
//         key: keyof T;
//         direction: "asc" | "desc";
//     } | null>(null);
//      // Initialize filters with empty strings for all possible keys
//     const [columnFilters, setColumnFilters] = useState<Record<keyof T, string>>(
//         () => {
//             const filters = {} as Record<keyof T, string>;
//             if (initialData.length > 0) {
//                 Object.keys(initialData[0]).forEach((key) => {
//                     filters[key as keyof T] = "";
//                 });
//             }
//             return filters;
//         }
//     );

//     const handleSort = (column: keyof T) => {
//         let direction: "asc" | "desc" = "asc";
//         if (sortConfig?.key === column && sortConfig.direction === "asc") {
//             direction = "desc";
//         }
//         setSortConfig({ key: column, direction });
//     };

//     const applyColumnFilter = (column: keyof T, value: string) => {
//         setColumnFilters((prev) => ({ ...prev, [column]: value }));
//     };

//     const clearColumnFilter = (column: keyof T) => {
//         setColumnFilters((prev) => ({ ...prev, [column]: "" }));
//     };
    
//     const resetAllFilters = () => {
//         setSortConfig(null);
//         setColumnFilters({} as Record<keyof T, string>);
//     };
//     const sortedAndFilteredData = useMemo(() => {
//         return initialData
//             .filter((item) => {
//                 // Apply search filter
//                 const matchesSearch =
//                     searchTerm === "" ||
//                     String(item[searchField])
//                         .toLowerCase()
//                         .includes(searchTerm.toLowerCase());

//                 // Apply column filters
//                 const matchesColumnFilters = Object.entries(columnFilters).every(
//                     ([column, filterValue]) => {
//                         if (!filterValue) return true;
            
//                         // Handle nested properties if needed
//                         let value = item[column as keyof T];
//                         if (column === 'TypeFonction' && 'fonction' in item) {
//                             value = (item as any).fonction?.TypeFonction;
//                         }
//                         if (column === 'IntituleFonction' && 'fonction' in item) {
//                             value = (item as any).fonction?.IntituleFonction;
//                         }

//                         return String(value)
//                             .toLowerCase()
//                             .includes(filterValue.toLowerCase());
//                     }
//                 );

//                 return matchesSearch && matchesColumnFilters;
//             })
//             .sort((a, b) => {
//                 if (!sortConfig) return 0;
//                 const { key, direction } = sortConfig;
        
//                 let valueA = a[key];
//                 let valueB = b[key];
        
//                 // Handle nested properties for sorting
//                 if (key === 'TypeFonction' && 'fonction' in a && 'fonction' in b) {
//                     valueA = (a as any).fonction.TypeFonction;
//                     valueB = (b as any).fonction.TypeFonction;
//                 }
//                 if (key === 'IntituleFonction' && 'fonction' in a && 'fonction' in b) {
//                     valueA = (a as any).fonction.IntituleFonction;
//                     valueB = (b as any).fonction.IntituleFonction;
//                 }

//                 if (valueA < valueB) return direction === "asc" ? -1 : 1;
//                 if (valueA > valueB) return direction === "asc" ? 1 : -1;
//                 return 0;
//             });
//     }, [initialData, searchTerm, searchField, columnFilters, sortConfig]);

//     return {
//         sortedAndFilteredData,
//         sortConfig,
//         columnFilters,
//         handleSort,
//         applyColumnFilter,
//         clearColumnFilter,
//         resetAllFilters,
//     };
// };
import { useMemo, useState } from "react";


export const useTableControls = <T extends Record<string, unknown>>(
    initialData: T[],
    searchTerm: string,
    searchField: keyof T
) => {
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

    const getNestedValue = (obj: any, path: string): unknown => {
        return path.split('.').reduce((o, p) => o?.[p], obj);
    };

    const handleSort = (column: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === column && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key: column, direction });
    };

    const applyColumnFilter = (column: string, value: string) => {
        setColumnFilters((prev) => ({ ...prev, [column]: value }));
    };

    const clearColumnFilter = (column: string) => {
        setColumnFilters((prev) => ({ ...prev, [column]: "" }));
    };
    
    const resetAllFilters = () => {
        setSortConfig(null);
        setColumnFilters({});
    };

    const sortedAndFilteredData = useMemo(() => {
        return initialData
            .filter((item) => {
                // Apply search filter
                const matchesSearch =
                    searchTerm === "" ||
                    String(getNestedValue(item, searchField as string))
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());

                // Apply column filters
                const matchesColumnFilters = Object.entries(columnFilters).every(
                    ([column, filterValue]) => {
                        if (!filterValue) return true;
                        
                        const value = getNestedValue(item, column);
                        return String(value)
                            .toLowerCase()
                            .includes(filterValue.toLowerCase());
                    }
                );

                return matchesSearch && matchesColumnFilters;
            })
            .sort((a, b) => {
                if (!sortConfig) return 0;
                const { key, direction } = sortConfig;
        
                const valueA = getNestedValue(a, key);
                const valueB = getNestedValue(b, key);

                if (valueA === undefined || valueB === undefined) return 0;
                
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return direction === "asc" 
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }
                
                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return direction === "asc" 
                        ? valueA - valueB
                        : valueB - valueA;
                }

                if (valueA instanceof Date && valueB instanceof Date) {
                    return direction === "asc"
                        ? valueA.getTime() - valueB.getTime()
                        : valueB.getTime() - valueA.getTime();
                }

                return 0;
            });
    }, [initialData, searchTerm, searchField, columnFilters, sortConfig]);

    return {
        sortedAndFilteredData,
        sortConfig,
        columnFilters,
        handleSort,
        applyColumnFilter,
        clearColumnFilter,
        resetAllFilters,
        getNestedValue
    };
};