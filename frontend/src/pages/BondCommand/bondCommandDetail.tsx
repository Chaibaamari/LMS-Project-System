"use client"
import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Trash2, Search, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getAuthToken, getYearExercice } from "@/util/Auth"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import type { AppDispatch, RootState } from "@/store/indexD"
import { BondCommandActions } from "@/store/BondCommand"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { BondCommand } from "@/assets/modelData"
import { Toaster } from "@/components/ui/toaster"

export default function BondCommandDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const StartDate = searchParams.get("dateDebut")
  const EndDate = searchParams.get("dateFin")
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const token = getAuthToken()
  const BondCommandData = useSelector((state: RootState) => state.BondCommand.BondCommandData)
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<BondCommand>()
  const [filteredEmployees, setFilteredEmployees] = useState<BondCommand[]>([])
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id) {
      fetchBondCommandDetail(id, StartDate || "", EndDate || "")
    }
  }, [id, StartDate, EndDate])
    useEffect(() => {
        if (BondCommandData) {
            const filtered = BondCommandData.filter(
                (employee) =>
                    employee.prenomnom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.Matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.Id_direction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.CodeFonction?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            setFilteredEmployees(filtered)
            setCurrentPage(1) // Reset to the first page when filtering
        }
    }, [BondCommandData, searchTerm]);

  const fetchBondCommandDetail = async (commandId: string, dateDebut: string, dateFin: string) => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://127.0.0.1:8000/api/formation-employees/${commandId}?dateDebut=${dateDebut}&dateFin=${dateFin}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch bond command details")
      }

      const data = await response.json()
      dispatch(BondCommandActions.FetchDataPlanNotifee(data.PlanCommand))
    } catch (error) {
      console.error("Error fetching bond command details:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors du chargement des détails du bon de commande",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmployee = async () => {
    if (!currentEmployee || !id) return

    setIsDeleting(true)
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/delete/bondCommand/${currentEmployee.Matricule}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ID_N: BondCommandData[0].ID_N }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to delete employee")
      }

      // Refresh the data
      await fetchBondCommandDetail(id, StartDate || "", EndDate || "")
      toast({
        title: "Employé supprimé",
        description: "L'employé a été supprimé avec succès.",
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'employé.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7913D]"></div>
      </div>
    )
  }

  if (!BondCommandData) {
    return (
        <div className="container mx-auto py-6">
            <Card className="border-t-4 border-t-[#F7913D]">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="bg-orange-50 p-4 rounded-full mb-4">
                        <FileText className="h-12 w-12 text-[#F7913D]" />
                    </div>
                    <h3 className="text-xl font-medium">Bon de commande non trouvé</h3>
                    <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
                        Le bon de commande demandé n'existe pas ou a été supprimé.
                    </p>
                    <Link to="/homePage/bondCommand">
                        <Button className="mt-6 bg-[#F7913D] hover:bg-[#e07d2d] text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour à la liste
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
    };

    return (
        <div className="container mx-auto py-6 px-4 md:px-6  min-h-screen">
            <Toaster />
            <div className="flex items-center justify-between mb-6">
                <Link to="/homePage/bondCommand">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à la liste
                    </Button>
                </Link>
            </div>

            <div className="bg-white p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center mb-8">
                    <div className="flex items-center mb-4 md:mb-0">
                        <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                    </div>
                    <div className="text-center md:text-start font-raleway">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#F7913D] tracking-tight">
                            BC FORMATION {getYearExercice()}
                        </h1>
                    </div>
                </div>

                <div ref={printRef}>
                    <Card className="mb-6 border-none overflow-hidden rounded-none shadow-none">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b pb-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <CardTitle className="text-xl md:text-2xl text-[#F7913D]">
                                        Bon de Commande #{BondCommandData[0].ID_N}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 mt-1">Créé le {"25-11-2024"}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-gray-500">Intitulé de l'Action</h3>
                                    <p className="text-lg font-semibold text-gray-800">{BondCommandData[0].Intitule_Action}</p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-gray-500">Type De Budget</h3>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {BondCommandData[0].Budget ? BondCommandData[0].Budget : 0}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-gray-500">Date de Début</h3>
                                    <p className="text-gray-800">
                                        {BondCommandData[0].Date_Deb
                                            ? format(new Date(BondCommandData[0].Date_Deb?.toString()), "dd MMMM yyyy", { locale: fr })
                                            : "Non définie"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-gray-500">Date de Fin</h3>
                                    <p className="text-gray-800">
                                        {BondCommandData[0].Date_fin
                                            ? format(new Date(BondCommandData[0].Date_fin?.toString()), "dd MMMM yyyy", { locale: fr })
                                            : "Non définie"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none overflow-hidden rounded-none">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b pb-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <CardTitle className="text-xl text-[#F7913D]">
                                    Liste des Employés ({filteredEmployees.length})
                                </CardTitle>
                                <div className="flex items-center space-x-2 mt-4 md:mt-0 w-full md:w-auto">
                                    <div className="relative w-full md:w-auto">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="search"
                                            placeholder="Rechercher un employé..."
                                            className="pl-10 w-full md:w-[300px] border-gray-300 focus:border-[#F7913D] focus:ring-[#F7913D]"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                STRUCTURE
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                DIRECTION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                MATRICULE
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                NOM PRENOM
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                Date Naissance
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                Sexe
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                CSP
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                DOMAINE DE FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                CODE DOMAINE
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                INTITULÉ EXACT DE L'ACTION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                NATURE DE FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                SOURCE DU BESOIN EN FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                TYPE FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                MODE FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                CODE FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                CODE ORGANISME DE FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                ORGANISME DE FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                LIEU DU DÉROULEMENT DE LA FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                PAYS
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                DATE DEBUT DE FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                DATE DE FIN DE FORMATION
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                H/J
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                type de pension
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 text-center whitespace-nowrap">
                                                OBSERVATIONS
                                            </TableHead>
                                            <TableHead className="bg-[#F7913D] text-white font-medium p-3 whitespace-nowrap text-center">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentItems.length > 0 ? (
                                            currentItems.map((command, index) => (
                                                <TableRow
                                                    key={command?.Matricule}
                                                    className={index % 2 === 0 ? "bg-white" : "bg-orange-50"}
                                                >
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Structure}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-center p-3 border-t border-gray-200">
                                                        {command.Nom_direction}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Matricule}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.prenomnom}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        { format(new Date(command.Date_Naissance?.toString()), "dd MMMM yyyy", { locale: fr })
                                                        }
                                                    </TableCell>
                                                    <TableCell className="font-medium text-center p-3 border-t border-gray-200">
                                                        {command.Sexe}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.CSP}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Domaine_Formation}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Code_Domaine_Formation}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-center p-3 border-t border-gray-200">
                                                        {command.Intitule_Action}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Nature_Formation}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Source_Besoin}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-center p-3 border-t border-gray-200">
                                                        {command.Type_Formation}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Mode_Formation}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Code_Formation}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Code_Organisme}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-center p-3 border-t border-gray-200">
                                                        {command.Nom_Organisme}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Lieu_Formation}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Pays}
                                                    </TableCell>
                                                    
                                                    <TableCell className="font-medium text-center p-3 border-t border-gray-200">
                                                        {command.Date_Deb
                                                            ? format(new Date(command.Date_Deb?.toString()), "dd MMMM yyyy", { locale: fr })
                                                            : "Non définie"}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Date_fin
                                                            ? format(new Date(command.Date_fin?.toString()), "dd MMMM yyyy", { locale: fr })
                                                            : "Non définie"}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Heure_jour}
                                                    </TableCell>
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        {command.Type_Pension ? command.Type_Pension : "/"}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-center p-3 border-t border-gray-200">
                                                        {command.Observation ? command.Observation : "/"}
                                                    </TableCell>
                                                
                                                    <TableCell className="text-center p-3 border-t border-gray-200">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full hover:bg-orange-100"
                                                                >
                                                                    <span className="sr-only">Ouvrir menu</span>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="16"
                                                                        height="16"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="h-4 w-4 text-gray-600"
                                                                    >
                                                                        <circle cx="5" cy="12" r="1" />
                                                                        <circle cx="12" cy="12" r="1" />
                                                                        <circle cx="19" cy="12" r="1" />
                                                                    </svg>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48 ">
                                                                <DropdownMenuLabel className="text-gray-500">Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setCurrentEmployee(command)
                                                                        setIsDeleteDialogOpen(true)
                                                                    }}
                                                                    className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Supprimer
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-32 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <FileText className="h-10 w-10 mb-2 text-gray-300" />
                                                        <p>Aucun employé trouvé.</p>
                                                        <p className="text-sm">Essayez de modifier vos critères de recherche.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                                <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t border-gray-200 bg-white">
                                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                        <p className="text-sm text-gray-500">
                                            Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredEmployees.length)} sur{" "}
                                            {filteredEmployees.length} employés
                                        </p>
                                        <Select
                                            value={itemsPerPage.toString()}
                                            onValueChange={(value) => {
                                                setItemsPerPage(Number(value))
                                                setCurrentPage(1)
                                            }}
                                        >
                                            <SelectTrigger className="h-8 w-[70px] border-gray-300">
                                                <SelectValue placeholder={itemsPerPage.toString()} />
                                            </SelectTrigger>
                                            <SelectContent side="top" className="min-w-[70px]">
                                                {[5, 10, 25, 50].map((value) => (
                                                    <SelectItem key={value} value={value.toString()}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            className="h-8 w-8 p-0 border-gray-300"
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="sr-only">Page précédente</span>
                                        </Button>
                                        <div className="flex items-center justify-center text-sm bg-orange-50 px-3 py-1  font-medium text-[#F7913D]">
                                            Page {currentPage} sur {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-8 w-8 p-0 border-gray-300"
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                            <span className="sr-only">Page suivante</span>
                                        </Button>
                                    </div>
                                </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-[#F7913D]">Supprimer un employé</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet employé ? Cette action ne peut pas être annulée.
                        </DialogDescription>
                    </DialogHeader>
                    {currentEmployee && (
                        <div className="grid gap-4 py-4">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                <p className="text-center text-gray-600">
                                    Vous êtes sur le point de supprimer l'employé:
                                    <span className="font-medium block text-gray-900 mt-1">
                                        {currentEmployee.prenomnom} (Matricule: {currentEmployee.Matricule})
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteEmployee}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Suppression...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
