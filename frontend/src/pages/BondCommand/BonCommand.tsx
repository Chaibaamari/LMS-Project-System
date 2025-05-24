"use client"
import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, FileText, Users } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { format, getMonth } from "date-fns"
import { fr } from "date-fns/locale"
import { getAuthToken, getYearExercice } from "@/util/Auth"
import { useDispatch } from "react-redux"
import { NotifeeActions } from "@/store/NotifeSlice"
import { useNavigate } from "react-router-dom"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import TabChange from "@/components/Tools/TabsChange"

interface BondCommand {
    ID_Formation: number
    Intitule_Action: string
    Date_Deb: string
    Date_fin: string
    Nombre_Employe: number
    Budget: number
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc658', '#ff7300']

export default function BondCommandPage() {
    const [bondCommands, setBondCommands] = useState<BondCommand[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const token = getAuthToken()
    const Year = getYearExercice()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        fetchBondCommands()
    }, [])

    const fetchBondCommands = async () => {
        try {
            setLoading(true)
            const response = await fetch("http://127.0.0.1:8000/api/bonCommand", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Year" : Year ?? ''
                },
            })

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
    }

    const viewBondCommandDetails = (id: number, startDate: string, finDate: string) => {
        navigate(`/homePage/bondCommand/${id}?dateDebut=${startDate}&dateFin=${finDate}`)
    }
    
    // Calculate statistics
    const statistics = useMemo(() => {
        if (!bondCommands.length) return null

        // Monthly distribution
        const monthlyData = Array(12).fill(0).map((_, i) => ({
            name: MONTHS[i],
            count: 0,
            budget: 0
        }))

        let totalBudget = 0
        let totalEmployees = 0
        let maxBudget = 0
        let minBudget = bondCommands[0]?.Budget || 0

        bondCommands.forEach(command => {
            const month = getMonth(new Date(command.Date_Deb))
            monthlyData[month].count += 1
            monthlyData[month].budget += command.Budget
            
            totalBudget += command.Budget
            totalEmployees += command.Nombre_Employe
            
            if (command.Budget > maxBudget) maxBudget = command.Budget
            if (command.Budget < minBudget) minBudget = command.Budget
        })

        // Filter out months with no data for the pie chart
        const pieData = monthlyData.filter(item => item.count > 0)
        console.log(pieData)
        return {
            monthlyData,
            pieData,
            totalCommands: bondCommands.length,
            totalBudget,
            totalEmployees,
            averageBudget: totalBudget / bondCommands.length,
        }
    }, [bondCommands])

    const filteredBondCommands = bondCommands.filter(
        (command) =>
            command.Intitule_Action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            format(new Date(command.Date_Deb), "dd/MM/yyyy").includes(searchTerm) ||
            format(new Date(command.Date_fin), "dd/MM/yyyy").includes(searchTerm),
    )

    return (
        
        <div className="container mx-auto py-6">
            <div className="flex flex-col md:flex-row items-center mb-8">
                        <div className="flex items-center mb-4 md:mb-0">
                            <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                        </div>
                        <div className="text-center md:text-start font-raleway">
                            <h1 className="text-3xl md:text-3xl font-bold text-[#F7913D] tracking-tight">
                                Bond Command {getYearExercice()}
                            </h1>
                        </div>
            </div>
            <TabChange
                tabs={[
                    {
                        label: "Statistiques",
                        content:
                            <>
                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                    </div>
                                ) : !statistics ? (
                                    <div className="text-center py-12">
                                        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-medium">Aucune donnée disponible</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Créez un bon de commande depuis la page Plan Notifié.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">Total Bons de Commande</CardTitle>
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold">{statistics.totalCommands}</div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Pour l'année {Year || new Date().getFullYear()}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">Nombre d'Employés</CardTitle>
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold">{statistics.totalEmployees}</div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Moyenne par bon: {Math.round(statistics.totalEmployees / statistics.totalCommands)}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                            <Card className="col-span-1 lg:col-span-2">
                                                <CardHeader>
                                                    <CardTitle>Bons de Commande par Mois</CardTitle>
                                                    <CardDescription>
                                                        Distribution mensuelle des bons de commande pour {Year || new Date().getFullYear()}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="h-80">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart
                                                            data={statistics.pieData}
                                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="name" />
                                                            <YAxis />
                                                            <Tooltip
                                                                formatter={(value, name) => {
                                                                    return [value, name === "count" ? "Nombre de bons" : "Budget"]
                                                                }}
                                                                labelFormatter={(label) => `Mois: ${label}`}
                                                            />
                                                            <Legend
                                                                formatter={(value) => {
                                                                    return value === "count" ? "Nombre de bons" : "Budget (DH)"
                                                                }}
                                                            />
                                                            <Bar dataKey="count" fill="#ff8500" name="count" />
                                                            
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Répartition par Mois</CardTitle>
                                                    <CardDescription>
                                                        Pourcentage des bons de commande par mois
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="h-80">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={statistics.pieData}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                                outerRadius={80}
                                                                fill="#8884d8"
                                                                dataKey="count"
                                                            >
                                                                {statistics.pieData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip
                                                                formatter={(value, name, props) => {
                                                                    return [`${value} bons`, props.payload.name]
                                                                }}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </>
                                )}
                            </>
                    },
                    {
                        label: "Liste des Bons de Commande",
                        content: <Card>
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
                                                    <TableHead>Intitulé Action</TableHead>
                                                    <TableHead>Date Début</TableHead>
                                                    <TableHead>Date Fin</TableHead>
                                                    <TableHead>Nombre d'Employés</TableHead>
                                                    <TableHead>Type de Budget</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredBondCommands.map((command, index) => {
                                                    const formattedStartDate = format(new Date(command.Date_Deb), "dd MMMM yyyy", { locale: fr });
                                                    const formattedEndtDate = format(new Date(command.Date_fin), "dd MMMM yyyy", { locale: fr });
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-medium">{command.Intitule_Action}</TableCell>
                                                            <TableCell>{format(new Date(command.Date_Deb), "dd MMMM yyyy", { locale: fr })}</TableCell>
                                                            <TableCell>{format(new Date(command.Date_fin), "dd MMMM yyyy", { locale: fr })}</TableCell>
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
                    }
                ]}
            />
        </div>
    );
}
