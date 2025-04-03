"use client";
import {  useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ArrowUp,
  ArrowDown,

} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users , FieldConfig } from "@/assets/modelData";
import { DynamicEditDialog } from "../DynamicForm"; // Import the reusable dialog
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "../ui/input";
import { useTableControls } from "@/hooks/useTableControls";
import { Pagination } from "../pagination";
import { getAuthToken, initialFormData } from "@/util/Auth";
import { DynamicSearch } from "../Search";

interface UsersTableProps {
    data: Users[];
}


export default function UsersTable({ data = [] }: UsersTableProps) {
    const navigate = useNavigate();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState<keyof Users>("Matricule");
    // pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Default to 10 items per page

    // State for selected rows
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    // filter and sort
    const { sortedAndFilteredData, sortConfig, columnFilters, handleSort, applyColumnFilter, clearColumnFilter } = useTableControls(data, searchTerm, searchField);
    // Edit Dialog State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        Matricule: "",
        prenomNom: "",
        Date_Naissance: "",
        Ancienneté: 0,
        Age : 0,
        Sexe: "",
        CSP: "",
        CodeFonction: 0,
        Fonction: "",
        Echelle: "",
    });
    const resetFilters = () => {
        setCurrentPage(1);
        
    } // still must to modify
    // Handle search
    const handleSearch = (term: string, field: keyof Users) => {
        setSearchTerm(term);
        setSearchField(field);
    };
    // Insert New Data
    const [insertDialogOpen, setInsertDialogOpen] = useState({
        isOpen: false,
        formData: initialFormData,
    });
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
    // Define the fields for the edit dialog
    const fields: FieldConfig[] = [
        { type: "input", name: "Matricule", label: "Matricule" },
        { type: "input", name: "Nom", label: "Nom" },
        { type: "input", name: "Prénom", label: "Prénom" },
        { type: "date", name: "Date_Naissance", label: "Date de Naissance" },
        { type: "date", name: "Date_Recrutement", label: "Date de Recrutement (années)" },
        { type: "number", name: "CodeFonction", label: "Fonction Employe" },
        { type: "input", name: "Echelle", label: "Echelle (degree)" },
        { type : "input", name: "Id_direction", label: "Direction" },
        {
            type: "select",
            name: "Sexe",
            label: "Sexe",
            options: [
                { value: "M", label: "M" },
                { value: "F", label: "F" },
            ],
        },
        {
            type: "select",
            name: "CSP",
            label: "CSP",
            options: [
                { value: "Cadre", label: "Cadre" },
                { value: "Maîtrise", label: "Maîtrise" },
                { value: "Exécution", label: "Exécution" },
            ],
        },
        {
            type: "select",
            name: "Fonction",
            label: "Fonction",
            options: [
                { value: "FST", label: "FST" },
                { value: "FSP", label: "FSP" },
                { value: "FSM", label: "FSM" },
            ],
        },
    ];

    // Handle input changes in the edit form
    const handleInputChange = (name: string, value: string) => {
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Save the edited data
    const params = useParams();
    const handleSaveEdit = async () => {
        console.log("Saved data:", editFormData);
        console.log("matricule data:", params.matricule);
        const dataAuth = {
            Matricule: editFormData.Matricule,
            Nom: editFormData.Nom,
            Prénom: editFormData.Prénom,
            Date_Naissance: editFormData.Date_Naissance,
            Age: Number(editFormData.Age),
            Ancienneté: Number(editFormData.Ancienneté),
            Sexe: editFormData.Sexe,  // Make sure this is being set in your form
            CSP: editFormData.CSP,    // Make sure this is being set in your form
            Fonction: editFormData.Fonction,
            Echelle: editFormData.Echelle,
            CodeFonction: Number(editFormData.CodeFonction),
            Id_direction: "DIR001",
        };
        
        console.log("Submitting:", dataAuth);
        const token = getAuthToken();
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/employes/edit/${params.matricule}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dataAuth),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                return;
            }
        
            const data = await response.json();
            console.log('Success:', data);
            navigate('/homePage'); // Redirect after success
        } catch (error) {
            console.error('API Request Failed:', error);
        }
        setEditDialogOpen(false);
    };
    // Open the edit dialog with the selected row's data
    const handleEdit = (item: Users) => {
        setEditFormData({
            Matricule: item.Matricule,
            prenomNom: item.prenomNom,
            Date_Naissance: item.Date_Naissance,
            Ancienneté: item.Ancienneté,
            Age: item.Age,
            Sexe: item.Sexe,
            CSP: item.CSP,
            CodeFonction: item.CodeFonction,
            Fonction: item.Fonction,
            Echelle: item.Echelle,
        });
        setEditDialogOpen(true);
    };
    // handle insert dialog
    const handleOpenInsertDialog = () => {
        setInsertDialogOpen({ ...insertDialogOpen, isOpen: true });
    };

    const handleSaveInsert = () => {
        setInsertDialogOpen((prevState) => {
            const newState = { ...prevState, isOpen: false };
            return newState;
        });
    };
    // Toggle row selection
    const toggleRowSelection = (Matricule: string) => {
        setSelectedRows((prev) =>
            prev.includes(Matricule)
                ? prev.filter((rowId) => rowId !== Matricule)
                : [...prev, Matricule]
        );
        console.log(selectedRows);
    };

    const renderSortIndicator = (column: keyof Users) => {
        if (sortConfig?.key === column) {
            return sortConfig.direction === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
        }
        return null;
    };
    
    const renderColumnHeader = (column: keyof Users, label: string, filterOptions?: string[]) => {
    return (
        <TableHead className="cursor-pointer select-none" onClick={() => handleSort(column)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {label}
                    {renderSortIndicator(column)}
                </div>

                {filterOptions && (
                    <Popover>
                        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
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
                                    <div className="space-y-1 mt-2">
                                        {filterOptions.map((option) => (
                                            <Button
                                                key={option}
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start text-sm h-7"
                                                onClick={() => applyColumnFilter(column, option)}
                                            >
                                                {option}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-between mt-2">
                                    <Button variant="outline" size="sm" onClick={() => clearColumnFilter(column)} className="text-xs">
                                        Clear
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => document.body.click()} // Close popover
                                        className="text-xs"
                                    >
                                        Apply
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
            <p className="pb-3">Affichage de {currentData.length} sur {sortedAndFilteredData.length} employés</p>
            <div className="flex flex-col sm:flex-row justify-between items-center  sm:items-center gap-2">
                <div className="text-sm text-muted-foreground">
                    <DynamicSearch
                        fields={[
                            { name: "Matricule", label: "Matricule" },
                            { name: "Nom", label: "Nom" },
                            { name: "Prénom", label: "Prénom" },
                            // Add other fields here
                        ]}
                        onSearch={handleSearch}
                    />
                </div>

                <div className="flex items-center gap-2">
                    {selectedRows.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{selectedRows.length} selected</span>
                        </div>
                    )}
                    <Button className="bg-sonatrachColor" onClick={resetFilters}>
                        Reset Data
                    </Button>
                    <Button className="bg-sonatrachColor" onClick={handleOpenInsertDialog}>
                        Inserer
                    </Button>
                    <Button  className="bg-red-500">
                        Supprimer
                    </Button>
                </div>
            </div>
            {/* Table with horizontal scroll for many columns */}
            <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="sticky left-0 bg-background pt-1 z-10">
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
                                {renderColumnHeader("Nom", "Nom")}
                                {renderColumnHeader("Prénom", "Prénom", ["John", "Jane", "Alice"])}
                                {renderColumnHeader("Date_Naissance", "Date Naissance")}
                                {renderColumnHeader("Date_Recrutement", "Date Recrutement")}
                                {renderColumnHeader("Age", "Age")}
                                {renderColumnHeader("Ancienneté", "Ancienneté")}
                                {renderColumnHeader("Sexe", "Sexe", ["M", "F"])}
                                {renderColumnHeader("CSP", "CSP", ["Cadre", "Maîtrise", "Exécution"])}
                                {renderColumnHeader("Fonction", "Fonction", ["FST", "FSM", "FSP"])}
                                {renderColumnHeader("Echelle", "Echelle")}
                                {renderColumnHeader("CodeFonction", "CodeFonction")}
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
                                        <TableCell className="text-center">{item.Nom}</TableCell>
                                        <TableCell className="text-center">{item.Prénom}</TableCell>
                                        <TableCell className="text-center">{item.Date_Naissance}</TableCell>
                                        <TableCell className="text-center">{item.Date_Recrutement}</TableCell>
                                        <TableCell className="text-center">{item.Age}</TableCell>
                                        <TableCell className="text-center">{item.Ancienneté}</TableCell>
                                        <TableCell className="text-center">{item.Sexe}</TableCell>
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
                                        <TableCell className="text-center">{item.Fonction}</TableCell>
                                        <TableCell className="text-center">{item.Echelle}</TableCell>
                                        <TableCell className="text-center">{item.CodeFonction}</TableCell>
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
                                                        {/* <Link to={`/Employee/${item.Matricule}`}> */}
                                                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                                <Pencil className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        {/* </Link> */}
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
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
                                    <TableCell colSpan={13} className="h-24 text-center">
                                        No results found.
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
            {insertDialogOpen.isOpen && (
                <DynamicEditDialog
                    isOpen={insertDialogOpen.isOpen}
                    onOpenChange={(isOpen) => setInsertDialogOpen({ ...insertDialogOpen, isOpen })}
                    title="Insert New User"
                    description="Fill in the user details below and click save."
                    fields={fields}
                    formData={insertDialogOpen.formData}
                    onChange={(name, value) => setInsertDialogOpen({ ...insertDialogOpen, formData: { ...insertDialogOpen.formData, [name]: value } })}
                    onSave={handleSaveInsert}
                    onCancel={() => setInsertDialogOpen({ ...insertDialogOpen, isOpen: false })}
                />
            )}
            
            {/* Reusable Edit Dialog */}
            <DynamicEditDialog
                isOpen={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                title="Edit User"
                description="Make changes to the user details here. Click save when you're done."
                fields={fields}
                formData={editFormData}
                onChange={handleInputChange}
                onSave={handleSaveEdit}
                onCancel={() => setEditDialogOpen(false)}
            />
        </div>
    );
}