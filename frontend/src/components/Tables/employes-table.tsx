"use client";
import {useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Plus,
  Loader2,
  SearchX,

} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {Link} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users} from "@/assets/modelData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "../ui/input";
import { useTableControls } from "@/hooks/useTableControls";
import { Pagination } from "../Tools/pagination";
import { calculateAge, calculeAnciennete, getAuthToken } from "@/util/Auth";
import { DynamicSearch } from "../Tools/Search";
import { useDispatch } from "react-redux";
import { EmployeeActions } from "@/store/EmployesSlice";


interface UsersTableProps {
    data: Users[];
}


export default function UsersTable({ data = [] }: UsersTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState<keyof Users>("Matricule");
    // pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Default to 10 items per page
    // State for selected rows
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    // filter and sort
    const { sortedAndFilteredData, sortConfig, columnFilters, handleSort, applyColumnFilter, clearColumnFilter , resetAllFilters } = useTableControls(data, searchTerm, searchField);
    
    const [isDeleting, setIsDeleting] = useState(false);
    const token = getAuthToken()
    const dispatch = useDispatch();
    const deleteSingleEmployee = async (matricule: string) => {
        try {
            setIsDeleting(false)
            dispatch(EmployeeActions.ShowNotificationDelete({
                IsVisible:true,
                status: 'pending',
                message: 'Chargement des employés en cours...'
            }));
            setIsDeleting(true);
            const response = await fetch(`http://127.0.0.1:8000/api/employes/delete/${matricule}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }
            setIsDeleting(false)
            dispatch(EmployeeActions.ShowNotificationDelete({
                IsVisible:true,
                status: 'success',
                message: 'Delete employé chargée avec succès'
            }));
            dispatch(EmployeeActions.ReferchLatestData(true));
        } catch (err) {
            console.log(err)
            dispatch(EmployeeActions.ShowNotificationDelete({
                IsVisible:true,
                status: 'failed',
                message: 'Erreur lors du chargement des employés'
            }));
        }
    };

    const deleteMultipleEmployees = async () => {
        if (selectedRows.length === 0) return;

        try {
            setIsDeleting(true);
            dispatch(EmployeeActions.ShowNotificationDelete({
                IsVisible:true,
                status: 'pending',
                message: 'Chargement des employés en cours...'
            }));
            const response = await fetch(
                'http://127.0.0.1:8000/api/employes/delete-multiple',
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ matricules: selectedRows }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete employees');
            }

            setSelectedRows([]);
            setIsDeleting(false);
            dispatch(EmployeeActions.ShowNotificationDelete({
                IsVisible:true,
                status: 'success',
                message: 'Delete employé chargée avec succès'
            }));
            dispatch(EmployeeActions.ReferchLatestData(true));
        } catch (err) {
            console.log(err)
            dispatch(EmployeeActions.ShowNotificationDelete({
                IsVisible:true,
                status: 'failed',
                message: 'Erreur lors du chargement des employés'
            }));
        }
    };


    const resetFilters = () => {
        setCurrentPage(1);
        setSearchTerm("");
        setSearchField("Matricule");
        resetAllFilters(); // This comes from useTableControls
        setSelectedRows([]);
    };// still must to modify
    // Handle search
    const handleSearch = (term: string, field: keyof Users) => {
        setSearchTerm(term);
        setSearchField(field);
    };
    //pagination Logic
    const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedAndFilteredData.slice(startIndex, endIndex);
    }, [sortedAndFilteredData, currentPage, itemsPerPage]);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    // Toggle row selection
    const toggleRowSelection = (Matricule: string) => {
        setSelectedRows((prev) =>
            prev.includes(Matricule)
                ? prev.filter((rowId) => rowId !== Matricule)
                : [...prev, Matricule]
        );
    };

    
    type Join<K, P> = K extends string | number
    ? P extends string | number
    ? `${K}.${P}`
    : never
    : never;
    
    type Prev = [never, 0, 1, 2, 3, ...0[]];
    type Paths<T, D extends number = 3> = [D] extends [never]
    ? never
    : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never
    }[keyof T]
    : '';
    type PlanPrevisionKeys = Paths<Users>
    
    const renderSortIndicator = (column: PlanPrevisionKeys) => {
        if (sortConfig?.key === column) {
            return sortConfig.direction === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
        }
        return null;
    };
    // In your UsersTable component, modify the renderColumnHeader function:
    const renderColumnHeader = (column: PlanPrevisionKeys, label: string, filterOptions?: string[]) => {
    return (
        <TableHead className="cursor-pointer select-none" onClick={() => handleSort(column)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center  text-xs text-center font-medium ">
                    {label}
                    {renderSortIndicator(column)}
                </div>

                {filterOptions && (
                    <Popover>
                        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 p-0">
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2" align="start">
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Filter {label}</h4>
                                <Input
                                    placeholder={`Filter ${label.toLowerCase()}...`}
                                    value={columnFilters[column] || ""}
                                    onChange={(e) => applyColumnFilter(column, e.target.value)}
                                    className="h-8 text-sm"
                                />
                                {filterOptions && (
                                    <div className="space-y-1 mt-2 max-h-32 overflow-y-auto">
                                        {filterOptions.map((option) => (
                                            <Button
                                                key={option}
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start text-sm h-7"
                                                onClick={() => {
                                                    applyColumnFilter(column, option);
                                                    document.body.click(); // Close popover after selection
                                                }}
                                            >
                                                {option}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-between mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            clearColumnFilter(column);
                                            document.body.click(); // Close popover
                                        }}
                                        className="text-xs"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        </TableHead>
    );
    };
    return (
        <div className="space-y-4 p-4 overflow-auto max-w-full">
            <p className="text-xs text-muted-foreground whitespace-nowrap">Affichage de {currentData.length} sur {sortedAndFilteredData.length} employés</p>
            <div className="flex flex-col sm:flex-row justify-between items-start  sm:items-center gap-2">
                <div className="text-sm text-muted-foreground">
                    <DynamicSearch
                        fields={[
                            { name: "Matricule", label: "Matricule" },
                            { name: "prenomnom", label: "Nom & Prénom" },
                            // Add other fields here
                        ]}
                        onSearch={handleSearch}
                    />
                </div>
                

                <div className="flex items-center gap-2">
                    {selectedRows.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{selectedRows.length} selected</span>
                        </div>
                    )}
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                    </Button>
                    <Link to={`/Emp/insert`}>
                        <Button size="sm" >
                            <Plus className="h-4 w-4 mr-1" />
                            Inserer
                        </Button>
                    </Link>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={selectedRows.length === 0 || isDeleting}
                        onClick={deleteMultipleEmployees}
                    >
                        {isDeleting ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Delete
                    </Button>
                </div>
            </div>
            <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="sticky left-0 bg-background pt-1 pr-2 z-10">
                                    <Checkbox
                                        aria-label="Select all"
                                        checked={selectedRows.length === data.length}
                                        onCheckedChange={() => {
                                            if (selectedRows.length === data.length) {
                                                setSelectedRows([]);
                                            } else {
                                                setSelectedRows(data.map((item) => item.Matricule));
                                            }
                                        }}
                                    />
                                </TableHead>
                                {renderColumnHeader("Matricule", "Matricule")}
                                {renderColumnHeader("prenomnom", "Nom & Prénom")}
                                {renderColumnHeader("Date_Naissance", "Date Naissance")}
                                {renderColumnHeader("Date_Recrutement", "Date Recrutement")}
                                {renderColumnHeader("Age", "  Age  ")}
                                {renderColumnHeader("Ancienneté", "Ancienneté")}
                                {renderColumnHeader("Sexe", "Sexe", ["M", "F"])}
                                {renderColumnHeader("CSP", "CSP", ["Cadre", "Maîtrise", "Exécution"])}
                                {renderColumnHeader("fonction.TypeFonction", "TypeFonction", ["FST", "FSM", "FSP"])}
                                {renderColumnHeader("fonction.IntituleFonction", "IntituleFonction")}
                                {renderColumnHeader("Echelle", "Echelle")}
                                {renderColumnHeader("CodeFonction", "CodeFonction")}
                                {renderColumnHeader("Id_direction", "CodeDirection")}
                                <TableHead className="sticky right-0 bg-background z-10 w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.length > 0 ? (
                                currentData.map((item) => (
                                    <TableRow
                                        key={item.Matricule}
                                        className={selectedRows.includes(item.Matricule) ? "bg-muted/50" : ""}
                                    >
                                        <TableCell className="sticky left-0 bg-background z-10">
                                            <Checkbox
                                                checked={selectedRows.includes(item.Matricule)}
                                                onCheckedChange={() => toggleRowSelection(item.Matricule)}
                                                aria-label={`Select row ${item.Matricule}`}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium ">{item.Matricule}</TableCell>
                                        <TableCell className="text-center w-[100%]">{item.prenomnom}</TableCell>
                                        <TableCell className="text-center w-[100%]">{item.Date_Naissance}</TableCell>
                                        <TableCell className="text-center w-[100%]">{item.Date_Recrutement}</TableCell>
                                        <TableCell className="text-center w-[100%]">{calculateAge(new Date(item.Date_Naissance))} ans</TableCell>
                                        <TableCell className="text-center w-[100%]">{calculeAnciennete(new Date(item.Date_Recrutement))} ans</TableCell>
                                        <TableCell className="text-center ">{item.Sexe}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.CSP === "Cadre"
                                                    ? "bg-green-100 text-green-800"
                                                    : item.CSP === "Maîtrise"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {item.CSP}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">{item.fonction.TypeFonction}</TableCell>
                                        <TableCell className="text-center">{item.fonction.IntituleFonction}</TableCell>
                                        <TableCell className="text-center">{item.Echelle}</TableCell>
                                        <TableCell className="text-center">{item.CodeFonction}</TableCell>
                                        <TableCell className="text-center">{item.Id_direction}</TableCell>
                                        <TableCell className="sticky right-0 bg-background z-10">
                                            <div className="flex items-center gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <Link to={`/Emp/update/${item.Matricule}`}>
                                                            <DropdownMenuItem>
                                                                <Pencil className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => deleteSingleEmployee(item.Matricule)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                <TableCell colSpan={15} className="h-40 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3 py-6">
                                        <div className="rounded-full bg-muted p-3">
                                            <SearchX className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-base font-medium">No data available</p>
                                            <p className="text-sm text-muted-foreground">No matching records found</p>
                                        </div>
                                    </div>
                                </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    goToNextPage={goToNextPage}
                    goToPreviousPage={goToPreviousPage}
                />
            )}
        </div>
    );
}