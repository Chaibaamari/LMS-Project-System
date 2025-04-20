"use client"
import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Trash2, MoreHorizontal, ChevronDown, ArrowUp, ArrowDown, RotateCcw, Plus, Loader2, SearchX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { PlanPrevision } from "@/assets/modelData"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "../ui/input"
import { useTableControls } from "@/hooks/useTableControls"
import { Pagination } from "../Tools/pagination"
import { DynamicSearch } from "../Tools/Search"
import { getAuthToken } from "@/util/Auth"
import { useDispatch } from "react-redux"
import { PrevisionActions } from "@/store/PrevisionSlice"
import ImportExportComponent from "../Tools/Ecxel"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"

interface PlanPrevisionTableProps {
  data: PlanPrevision[]
}

export default function PrevisionTable({ data = [] }: PlanPrevisionTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  const [searchField, setSearchField] = useState<keyof PlanPrevision>("Matricule")
  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(13) // Default to 13 items per page
  // State for selected rows
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  // filter and sort
  const {
    sortedAndFilteredData,
    sortConfig,
    columnFilters,
    handleSort,
    applyColumnFilter,
    clearColumnFilter,
    resetAllFilters,
  } = useTableControls(data, searchTerm, searchField)
  const [isDeleting, setIsDeleting] = useState(false)
  const token = getAuthToken()
  const dispatch = useDispatch()
  const deleteSingleEmployee = async (id: string) => {
    try {
      setIsDeleting(false)
      dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: "pending",
          message: "Chargement des prévision en cours...",
        }),
      )
      setIsDeleting(true)
      const response = await fetch(`http://127.0.0.1:8000/api/previsions/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to delete prévision")
      }
      setIsDeleting(false)
      dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: "success",
          message: "Delete prévisions chargée avec succès",
        }),
      )
      dispatch(PrevisionActions.ReferchLatestData(true))
    } catch (err) {
      console.log(err)
      dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: "failed",
          message: "Erreur lors du chargement des prévisions",
        }),
      )
    }
  }

  const deleteMultipleEmployees = async () => {
    if (selectedRows.length === 0) return

    try {
      setIsDeleting(true)
      dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: "pending",
          message: "Chargement des prévisions en cours...",
        }),
      )
      const response = await fetch("http://127.0.0.1:8000/api/previsions/delete-multiple", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ IDs: selectedRows }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete prévisions")
      }

      setSelectedRows([])
      setIsDeleting(false)
      dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: "success",
          message: "Delete prévision chargée avec succès",
        }),
      )
      dispatch(PrevisionActions.ReferchLatestData(true))
    } catch (err) {
      console.log(err)
      dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: "failed",
          message: "Erreur lors du chargement des prévisions",
        }),
      )
    }
  }

  const resetFilters = () => {
    setCurrentPage(1)
    setSearchTerm("")
    setSearchField("Matricule")
    resetAllFilters() // This comes from useTableControls
    setSelectedRows([])
  }

  const importPrevData = async (file: File) => {
    const formData = new FormData()
    formData.append("previsions", file)

    try {
      dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: "pending",
          message: "Chargement des prévisions en cours...",
        }),
      )
      const response = await fetch(`http://127.0.0.1:8000/api/previsions/import`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const resData = await response.json();
      if (!response.ok) {
        dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: 'failed',
          message: `Erreur lors de l'importation des prévisions : ${resData.errors.length} ligne(s) ont échoué à la validation.`
        }));
        dispatch(PrevisionActions.ReferchLatestData(true))
        return navigate("/homePage/PlanPrevision");
      }
      
      dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: 'success',
          message: resData.message,
        }),
      )
      dispatch(PrevisionActions.ReferchLatestData(true))
    } catch (error) {
      dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: "failed",
          message: error,
        }),
      )
    }
  }

  const exportPrevData = async () => {
    dispatch(
      PrevisionActions.ShowNotification({
        IsVisible: true,
        status: "pending",
        message: "Préparation de l'export en cours...",
      }),
    )
    fetch("http://127.0.0.1:8000/api/previsions/export", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "previsions.xlsx"
        document.body.appendChild(a)
        a.click()
        a.remove()

        dispatch(
          PrevisionActions.ShowNotification({
            IsVisible: true,
            status: "success",
            message: "Export réussi!",
          }),
        )
      })
      .catch((error) => {
        console.error(error)
        dispatch(
          PrevisionActions.ShowNotification({
            IsVisible: true,
            status: "failed",
            message: "Erreur lors de l'export",
          }),
        )
      })
    // For now, just show a success notification after a delay
    setTimeout(() => {
      dispatch(
        PrevisionActions.ShowNotification({
          IsVisible: true,
          status: "success",
          message: "Export réussi!",
        }),
      )
    }, 3000)
  }

  //pagination Logic
  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage)

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedAndFilteredData.slice(startIndex, endIndex)
  }, [sortedAndFilteredData, currentPage, itemsPerPage])

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  // Toggle row selection
  const toggleRowSelection = (ID_N: number) => {
    const ID = String(ID_N)
    setSelectedRows((prev) => (prev.includes(ID) ? prev.filter((rowId) => rowId !== ID) : [...prev, ID]))
    console.log(selectedRows)
  }

  type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}.${P}` : never) : never
  type Prev = [never, 0, 1, 2, 3, ...0[]]
  type Paths<T, D extends number = 3> = [D] extends [never]
    ? never
    : T extends object
      ? {
          [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>> : never
        }[keyof T]
      : ""
  type PlanPrevisionKeys = Paths<PlanPrevision>

  const renderSortIndicator = (column: string) => {
    if (sortConfig?.key === column) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp className="h-4 w-4 ml-1" />
      ) : (
        <ArrowDown className="h-4 w-4 ml-1" />
      )
    }
    return null
  }
  const handleSearch = (term: string, field: keyof PlanPrevision) => {
    setSearchTerm(term)
    setSearchField(field)
  }

  const renderColumnHeader = (column: PlanPrevisionKeys, label: string, filterOptions?: string[]) => {
    return (
      <TableHead className="cursor-pointer select-none" onClick={() => handleSort(column)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-center text-xs font-medium">
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
                          className="w-full justify-start text-sm h-7 "
                          onClick={() => {
                            applyColumnFilter(column, option)
                            document.body.click()
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
                        clearColumnFilter(column)
                        document.body.click()
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
    )
  }
    return (
        <div className="space-y-4 p-4 overflow-auto max-w-full">
            <p className="text-xs text-muted-foreground whitespace-nowrap">
                Affichage de {currentData.length} sur {sortedAndFilteredData.length} Plan Prévision
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-start  sm:items-center gap-2">
                <div className="text-sm text-muted-foreground w-full">
                    <DynamicSearch
                        fields={[
                            { name: "Matricule", label: "Matricule" },
                            { name: "employe.prenomnom", label: "Nom & Prénom" },
                            { name: "employe.fonction.IntituleFonction", label: "IntituleFonction" },
                            { name: "formation.Intitule_Action", label: "IntituleAction" },
                            { name: "formation.organisme.Lieu_Formation", label: "Lieu" },
                            { name: "formation.organisme.Pays", label: "Pays" },
                            // Add other fields here
                        ]}
                        onSearch={handleSearch}
                    />
                </div>

                <ImportExportComponent importPrevData={importPrevData} exportPrevData={exportPrevData} />
                <div className="flex items-center gap-2">
                    {selectedRows.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{selectedRows.length} selected</span>
                        </div>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                ...
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={resetFilters}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset Filters
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <Link to="/PrevPlan/insert" className="w-full">
                                <DropdownMenuItem>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Insert New
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={selectedRows.length === 0}
                        onClick={deleteMultipleEmployees}
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />}
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
                                        checked={
                                            sortedAndFilteredData.length > 0 &&
                                            sortedAndFilteredData.every((item) => selectedRows.includes(String(item.ID_N)))
                                        }
                                        onCheckedChange={() => {
                                            if (sortedAndFilteredData.every((item) => selectedRows.includes(String(item.ID_N)))) {
                                                // Unselect all filtered items
                                                const filteredIds = sortedAndFilteredData.map((item) => String(item.ID_N))
                                                setSelectedRows((prev) => prev.filter((id) => !filteredIds.includes(id)))
                                            } else {
                                                // Select all filtered items
                                                const filteredIds = sortedAndFilteredData.map((item) => String(item.ID_N))
                                                setSelectedRows((prev) => {
                                                    const newSelection = [...prev]
                                                    filteredIds.forEach((id) => {
                                                        if (!newSelection.includes(id)) {
                                                            newSelection.push(id)
                                                        }
                                                    })
                                                    return newSelection
                                                })
                                            }
                                        }}
                                    />
                                </TableHead>
                                {renderColumnHeader("employe.direction.Structure", "STRUCTURE")}
                                {renderColumnHeader("employe.direction.Nom_direction", "Direction")}
                                {renderColumnHeader("employe.Matricule", "Matricule")}
                                {renderColumnHeader("employe.prenomnom", "Nom & Prénom")}
                                {renderColumnHeader("employe.Date_Naissance", "Date Naissance")}
                                {renderColumnHeader("employe.Date_Recrutement", "Date Recrutement")}
                                {renderColumnHeader("employe.Sexe", "Sexe", ["M", "F"])}
                                {renderColumnHeader("employe.CSP", "CSP", ["Cadre", "Maîtrise", "Exécution"])}
                                {renderColumnHeader("employe.Echelle", "Echelle")}
                                {renderColumnHeader("employe.fonction.TypeFonction", "TypeFonction", ["FST", "FSM", "FSP"])}
                                {renderColumnHeader("employe.CodeFonction", "CodeFonction")}
                                {renderColumnHeader("employe.fonction.IntituleFonction", "IntituleFonction")}
                                {renderColumnHeader("employe.Id_direction", "CodeDirection")}
                                {renderColumnHeader("formation.Domaine_Formation", "Domaine Formation")}
                                {renderColumnHeader("formation.Code_Formation", "Code Formation", [
                                    "CDA",
                                    "CDE",
                                    "CDI",
                                    "LDA",
                                    "LDI",
                                    "LDE",
                                ])}
                                {renderColumnHeader("formation.Intitule_Action", "Intitule de Action")}
                                {renderColumnHeader("formation.Nature_Formation", "Nature de Formation")}
                                {renderColumnHeader("formation.Niveau_Formation", "Niveau de Formation")}
                                {renderColumnHeader("formation.Source_Besoin", "Source Besoin de formation")}
                                {renderColumnHeader("formation.Type_Formation", "Type Formation")}
                                {renderColumnHeader("formation.Mode_Formation", "Mode Formation", [
                                    "PRESENTIEL",
                                    "BLENDED",
                                    "OJT",
                                    "DISTANCIEL",
                                    "E-LEARNING",
                                ])}
                                {renderColumnHeader("formation.Code_Domaine_Formation", "Code Domaine Formation")}
                                {renderColumnHeader("formation.organisme.Code_Organisme", "Code Organisme", [
                                    "AO",
                                    "CFA",
                                    "IAP",
                                    "SMA",
                                    "ETR",
                                ])}
                                {renderColumnHeader("formation.organisme.Nom_Organisme", "Nom Organisme")}
                                {renderColumnHeader("formation.organisme.Lieu_Formation", "Lieu Formation")}
                                {renderColumnHeader("formation.organisme.Pays", "Pays")}
                                {renderColumnHeader("formation.Heure_jour", "Heure_jour")}
                                {renderColumnHeader("Frais_Pedagogiques", "Frais Pedagogiques")}
                                {renderColumnHeader("Frais_Hebergement", "Frais Hebergement")}
                                {renderColumnHeader("Frais_Transport", "Frais Transport")}
                                {renderColumnHeader("type", "Type Pension")}
                                {renderColumnHeader("etat", "etat")}
                                {renderColumnHeader("Observation", "Observation")}
                                <TableHead className="sticky right-0 bg-background z-10 w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.length > 0 ? (
                                currentData.map((item) => (
                                    <TableRow key={item.ID_N} className={selectedRows.includes(String(item.ID_N)) ? "bg-muted/50" : ""}>
                                        <TableCell className="sticky left-0 bg-background z-10">
                                            <Checkbox
                                                checked={selectedRows.includes(String(item.ID_N))}
                                                onCheckedChange={() => toggleRowSelection(item.ID_N)}
                                                aria-label={`Select row ${item.ID_N}`}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center w-[100%]">{item.employe.direction.Structure ?? "—"}</TableCell>
                                        <TableCell className="text-center w-[100%]">
                                            {item.employe.direction.Nom_direction ?? "—"}
                                        </TableCell>
                                        <TableCell className="font-medium ">{item.employe.Matricule ?? "—"}</TableCell>
                                        <TableCell className="text-center w-[100%]">{item.employe.prenomnom ?? "—"}</TableCell>
                                        <TableCell className="text-center ">{item.employe.Date_Naissance ?? "—"}</TableCell>
                                        <TableCell className="text-center ">{item.employe.Date_Recrutement ?? "—"}</TableCell>
                                        <TableCell className="text-center ">{item.employe.Sexe ?? "—"}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.employe.CSP === "Cadre"
                                                        ? "bg-green-100 text-green-800"
                                                        : item.employe.CSP === "Maîtrise"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {item.employe.CSP ?? "—"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">{item.employe.Echelle ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.employe.fonction.TypeFonction ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.employe.CodeFonction ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.employe.fonction.IntituleFonction ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.employe.Id_direction ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.Domaine_Formation ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.Code_Formation ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.Intitule_Action ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.Nature_Formation ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.Niveau_Formation ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.Source_Besoin ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.Type_Formation ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.Mode_Formation ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation?.Code_Domaine_Formation ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.organisme?.Code_Organisme ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.organisme?.Nom_Organisme ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.organisme?.Lieu_Formation ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.formation.organisme?.Pays}</TableCell>
                                        <TableCell className="text-center">{item.formation?.Heure_jour }</TableCell>
                                        <TableCell className="text-center">{item.Frais_Pedagogiques ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.Frais_Hebergement ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.Frais_Transport ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.type ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.etat ?? "—"}</TableCell>
                                        <TableCell className="text-center">{item.Observation ?? "—"}</TableCell>
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
                                                        <Link to={`/prev/update/${item.ID_N}`}>
                                                            <DropdownMenuItem>
                                                                <Pencil className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => deleteSingleEmployee(String(item.ID_N))}
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
                                <TableCell colSpan={20} className="h-40 text-center">
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

