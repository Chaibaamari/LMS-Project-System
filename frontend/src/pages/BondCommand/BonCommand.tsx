"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, Folder } from "lucide-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getAuthToken } from "@/util/Auth"
import { useDispatch } from "react-redux"
import { NotifeeActions } from "@/store/NotifeSlice"
import { useNavigate } from "react-router-dom"

interface BondCommand {
  ID_Formation: number
  Intitule_Action: string
  Date_Deb: string
  Date_fin: string
  Nombre_Employe: number
  Budget: number
};

export default function BondCommandPage() {
  const [bondCommands, setBondCommands] = useState<BondCommand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const token = getAuthToken()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        fetchBondCommands()
    }, []);

    const fetchBondCommands = async () => {
        try {
            setLoading(true)
            const response = await fetch("http://127.0.0.1:8000/api/bonCommand", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch bond commands")
            }

            const data = await response.json()
            setBondCommands(data.data || [])
        } catch (error) {
            console.error("Error fetching bond commands:", error)
            dispatch(
                NotifeeActions.ShowNotification({
                    IsVisible: true,
                    status: "failed",
                    message: "Erreur lors du chargement des bons de commande",
                }),
            )
        } finally {
            setLoading(false)
        }
    };
    const viewBondCommandDetails = (id: number) => {
        // Navigate to details page
        navigate(`/homePage/bondCommand/${id}`)
    };
    

    const filteredBondCommands = bondCommands.filter(
        (command) =>
            command.Intitule_Action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            format(new Date(command.Date_Deb), "dd/MM/yyyy").includes(searchTerm) ||
            format(new Date(command.Date_fin), "dd/MM/yyyy").includes(searchTerm),
    );

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle>Bons de Commande</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center mb-6">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Rechercher par action, date..."
                                className="w-full pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredBondCommands.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">Aucun bon de commande trouvé</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Créez un bon de commande depuis la page Plan Notifié.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Intitulé Action</TableHead>
                                        <TableHead>Date Début</TableHead>
                                        <TableHead>Date Fin</TableHead>
                                        {/* <TableHead>Date Création</TableHead> */}
                                        <TableHead>Nombre d'Employés</TableHead>
                                        <TableHead>Coût Total</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBondCommands.map((command) => (
                                        <TableRow key={command.ID_Formation}>
                                            <TableCell>{command.ID_Formation}</TableCell>
                                            <TableCell className="font-medium">{command.Intitule_Action}</TableCell>
                                            <TableCell>{format(new Date(command.Date_Deb), "dd MMMM yyyy", { locale: fr })}</TableCell>
                                            <TableCell>{format(new Date(command.Date_fin), "dd MMMM yyyy", { locale: fr })}</TableCell>
                                            {/* <TableCell>{format(new Date(command.createdAt), "dd/MM/yyyy HH:mm", { locale: fr })}</TableCell> */}
                                            <TableCell>{command.Nombre_Employe}</TableCell>
                                            <TableCell>{command.Budget.toLocaleString("fr-FR")} Kda</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => viewBondCommandDetails(command.ID_Formation)}
                                                        title="Voir les détails"
                                                    >
                                                        <Search className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        // onClick={() => createTbf(command.Date_Deb)}
                                                        title="Voir les détails"
                                                    >
                                                        <Folder  className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
