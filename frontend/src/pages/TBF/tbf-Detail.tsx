import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getAuthToken } from "@/util/Auth"
import { useDispatch } from "react-redux"
import { NotifeeActions } from "@/store/NotifeSlice"
import { Link, useNavigate, useParams } from "react-router-dom"

interface BondCommand {
  ID_Formation: number
  Intitule_Action: string
  Date_Deb: string
  Date_fin: string
  Nombre_Employe: number
  Budget: number
};

export default function TbfDetailPage() {
    const [bondCommands, setBondCommands] = useState<BondCommand[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const token = getAuthToken();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const id = Number(params.id);
    const stored = localStorage.getItem('selectedYear')
    console.log(stored)

    useEffect(() => {
        fetchBondCommands()
    }, [id]);

    const fetchBondCommands = async () => {
        try {
            setLoading(true)
            const response = await fetch(`http://127.0.0.1:8000/api/BC/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'Year': stored ? stored : new Date().getFullYear().toString(),
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
    console.log(bondCommands)
    const viewBondCommandDetails = (id: number ,  startDate: string , finDate : string) => {
        // Navigate to details page
        navigate(`/homePage/bondCommand/${id}?dateDebut=${startDate}&dateFin=${finDate}`)
    };
    

    const filteredBondCommands = bondCommands.filter(
        (command) =>
            command.Intitule_Action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            format(new Date(command.Date_Deb), "dd/MM/yyyy").includes(searchTerm) ||
            format(new Date(command.Date_fin), "dd/MM/yyyy").includes(searchTerm),
    );

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <Link to="/homePage/TBF">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à la liste
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle>Bonds de Commande</CardTitle>
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
                                        <TableHead>Intitulé Action</TableHead>
                                        <TableHead>Date Début</TableHead>
                                        <TableHead>Date Fin</TableHead>
                                        <TableHead>Nombre d'Employés</TableHead>
                                        <TableHead>Type De Budget</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBondCommands.map((command, index) => {
                                        const formattedStartDate = format(command.Date_Deb, "dd MMMM yyyy", { locale: fr });
                                        const formattedEndtDate = format(command.Date_fin, "dd MMMM yyyy", { locale: fr });
                                        return (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{command.Intitule_Action}</TableCell>
                                                <TableCell>{format(new Date(command.Date_Deb), "dd MMMM yyyy", { locale: fr })}</TableCell>
                                                <TableCell>{format(new Date(command.Date_fin), "dd MMMM yyyy", { locale: fr })}</TableCell>
                                                {/* <TableCell>{format(new Date(command.createdAt), "dd/MM/yyyy HH:mm", { locale: fr })}</TableCell> */}
                                                <TableCell>{command.Nombre_Employe}</TableCell>
                                                <TableCell>{command.Budget.toLocaleString("fr-FR")}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => viewBondCommandDetails(command.ID_Formation, formattedStartDate, formattedEndtDate)}
                                                            title="Voir les détails"
                                                        >
                                                            <Search className="h-4 w-4" />
                                                        </Button>
                                                        
                                                    </div>
                                                </TableCell>
                                            </TableRow>)
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
