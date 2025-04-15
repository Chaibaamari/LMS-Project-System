"use client"
import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getAuthToken } from "@/util/Auth"
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
import { BondCommand } from "@/assets/modelData"
import { Toaster } from "@/components/ui/toaster"

export default function BondCommandDetailPage() {
  const params = useParams()
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
    if (params.id) {
      fetchBondCommandDetail(params.id)
    }
  }, [params.id])

    useEffect(() => {
        if (BondCommandData) {
            const filtered = BondCommandData.filter(
                (employee) =>
                    employee.employe?.prenomnom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.employe?.Matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.employe?.Id_direction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.employe?.CodeFonction?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            setFilteredEmployees(filtered)
        }
    }, [BondCommandData, searchTerm]);

    const fetchBondCommandDetail = async (commandId: string) => {
        try {
            setLoading(true)
            const response = await fetch(`http://127.0.0.1:8000/api/formation-employees/${commandId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            })

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
    };

    const handleDeleteEmployee = async () => {
        if (!currentEmployee || !params.id) return

        setIsDeleting(true)
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/delete/bondCommand/${currentEmployee.employe.Matricule}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ID_N: BondCommandData[0].ID_N }),
                }
            )

            if (!response.ok) {
                throw new Error("Failed to delete employee")
            }

            // Refresh the data
            await fetchBondCommandDetail(params.id)
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
    };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
    }

    if (!BondCommandData) {
      return (
          <div className="container mx-auto py-6">
              <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                      <h3 className="text-lg font-medium">Bon de commande non trouvé</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                          Le bon de commande demandé n'existe pas ou a été supprimé.
                      </p>
                      <Link to="/homePage/bondCommand">
                          <Button className="mt-4">
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
        <div className="container mx-auto py-6">
            <Toaster />
            <div className="flex items-center justify-between mb-6">
                <Link to="/homePage/bondCommand">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à la liste
                    </Button>
                </Link>
            </div>
            <div className="flex items-center justify-between mb-8 text-center">
                <div className="flex items-center">
                    <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-12 mr-4" />
                    <div>
                        <h1 className="text-2xl font-bold">Détails du Bon de Commande</h1>
                        <p className="text-muted-foreground">Gérez les détails et les employés associés</p>
                    </div>
                </div>
            </div>

            <div ref={printRef}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Bon de Commande #{BondCommandData[0].ID_N}</CardTitle>
                        <CardDescription>
                            Créé le{"25-11-2024"} //  must be updated
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Intitulé de l'Action</h3>
                                <p className="text-lg font-semibold">{BondCommandData[0].formation.Intitule_Action}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Coût Total</h3>
                                <p className="text-lg font-semibold">{BondCommandData[0].Budget ? BondCommandData[0].Budget : 0} DH</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Date de Début</h3>
                                <p>
                                    {BondCommandData[0].Date_Deb
                                        ? format(new Date(BondCommandData[0].Date_Deb?.toString()), "dd MMMM yyyy", { locale: fr })
                                        : "Non définie"}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Date de Fin</h3>
                                <p>
                                    {BondCommandData[0].Date_fin
                                        ? format(new Date(BondCommandData[0].Date_fin?.toString()), "dd MMMM yyyy", { locale: fr })
                                        : "Non définie"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Liste des Employés ({filteredEmployees.length})</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Rechercher..."
                                    className="pl-8 w-[200px] md:w-[300px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Matricule</TableHead>
                                        <TableHead>Nom & Prénom</TableHead>
                                        <TableHead>Direction</TableHead>
                                        <TableHead>Fonction</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((command) => (
                                            <TableRow key={command.employe?.Matricule}>
                                                <TableCell>{command.employe?.Matricule}</TableCell>
                                                <TableCell className="font-medium">{command.employe?.prenomnom}</TableCell>
                                                <TableCell>{command.employe?.Id_direction}</TableCell>
                                                <TableCell>{command.employe?.CodeFonction}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
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
                                                                    className="h-4 w-4"
                                                                >
                                                                    <circle cx="5" cy="12" r="1" />
                                                                    <circle cx="12" cy="12" r="1" />
                                                                    <circle cx="19" cy="12" r="1" />
                                                                </svg>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setCurrentEmployee(command)
                                                                    setIsDeleteDialogOpen(true)
                                                                }}
                                                                className="text-destructive"
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
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                Aucun employé trouvé.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {filteredEmployees.length > itemsPerPage && (
                            <div className="flex items-center justify-between space-x-6 mt-4">
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm text-muted-foreground">
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
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue placeholder={itemsPerPage.toString()} />
                                        </SelectTrigger>
                                        <SelectContent side="top">
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
                                        className="h-8 w-8 p-0"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="sr-only">Page précédente</span>
                                    </Button>
                                    <div className="flex items-center justify-center text-sm">
                                        Page {currentPage} sur {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                        <span className="sr-only">Page suivante</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Supprimer un employé</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet employé ? Cette action ne peut pas être annulée.
                        </DialogDescription>
                    </DialogHeader>
                    {currentEmployee && (
                        <div className="grid gap-4 py-4">
                            <p className="text-center text-muted-foreground">
                                Vous êtes sur le point de supprimer l'employé:
                                <span className="font-medium block text-foreground">
                                    {currentEmployee.employe.prenomnom} (Matricule: {currentEmployee.employe.Matricule})
                                </span>
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteEmployee}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}