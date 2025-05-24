"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, Search, Users, Timer, SortAsc, SortDesc, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination"

interface FormationEnCours {
  ID_Formation: string | number
  Intitule_Action: string
  Date_Deb: string
  Date_fin: string
  pourcentage: number
  days_remaining: number
}

interface FormationsEnCoursProps {
  data: FormationEnCours[]
}

export default function EnCours({ data = [] }: FormationsEnCoursProps) {
  // Format date to display in a more readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    const filteredFormations = data?.filter((formation) =>
        formation.Intitule_Action.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    
      // Sort formations
    const sortedFormations = [...filteredFormations].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.Intitule_Action.localeCompare(b.Intitule_Action)
        } else {
            return b.Intitule_Action.localeCompare(a.Intitule_Action)
        }
    });
    
      // Paginate formations
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = sortedFormations.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(sortedFormations.length / itemsPerPage)
    

  // Get completion status
  const getCompletionStatus = (percentage: number) => {
    if (percentage === 0) return { label: "Non commencé", color: "bg-slate-100 text-slate-500" }
    if (percentage < 25) return { label: "Démarrage", color: "bg-blue-50 text-blue-500" }
    if (percentage < 50) return { label: "En cours", color: "bg-amber-50 text-amber-500" }
    if (percentage < 75) return { label: "Avancé", color: "bg-indigo-50 text-indigo-500" }
    if (percentage < 100) return { label: "Presque terminé", color: "bg-emerald-50 text-emerald-500" }
    return { label: "Terminé", color: "bg-green-50 text-green-600" }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }
    return (
        <div className="space-y-6">
            {/* Header section with search */}
            {/* Header section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="px-3 py-1.5">
                        <CheckCircle2 className="mr-1 h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                            {data.length} Formation{data.length !== 1 ? "s" : ""} on cours Exécution
                        </span>
                    </Badge>
                </div>
        
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Rechercher une formation..."
                            className="pl-8 w-full sm:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleSortOrder}
                            aria-label={sortOrder === "asc" ? "Trier par ordre décroissant" : "Trier par ordre croissant"}
                        >
                            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Training cards grid */}
            <div className="grid gap-4 grid-cols-1">
                {currentItems?.length > 0 ? (
                    currentItems.map((item, index) => {
                        const status = getCompletionStatus(item.pourcentage)
                        const startDate = new Date(item.Date_Deb)
                        const endDate = new Date(item.Date_fin)
                        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                        const completedDays = Math.floor((totalDays * item.pourcentage) / 100)

                        return (
                            <Card
                                key={index}
                                className="overflow-hidden border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-sm"
                            >
                                <div className="flex flex-col sm:flex-row">

                                    <div className="relative w-full sm:w-1/4 max-w-[200px]">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        <img
                                            src="/formationEnCoures.jpg"
                                            className="h-48 sm:h-full w-full object-cover"
                                            alt={`${item.Intitule_Action} thumbnail`}
                                        />
                                        <Badge className={`absolute top-2 right-2 ${status.color} border-0`}>{status.label}</Badge>
                                    </div>

                                    {/* Content section */}
                                    <CardContent className="flex-1 p-4 sm:p-6">
                                        <div className="flex items-center mb-2">
                                            <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 mr-2">
                                                <span className="text-sky-500 mr-1">■</span> formation
                                            </Badge>
                                        </div>

                                        <h3 className="font-semibold text-gray-800 text-lg mb-3">{item.Intitule_Action}</h3>

                                        {/* Progress section - FIXED SIZE */}
                                        <div className="mb-1 w-full max-w-md">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs text-gray-500">Progression</span>
                                                <span className="text-xs font-medium">{item.pourcentage}%</span>
                                            </div>
                                            <Progress value={item.pourcentage} className="h-2.5 w-full" />
                                        </div>

                                        {/* Statistics grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Users className="w-4 h-4 mr-2 text-slate-700 flex-shrink-0" />
                                                <span>
                                                    Jours complétés:{" "}
                                                    <span className="font-medium">
                                                        {completedDays}/{totalDays}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Timer className="w-4 h-4 mr-2 text-slate-700 flex-shrink-0" />
                                                <span>
                                                    Temps estimé: <span className="font-medium">{totalDays} jours</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Date information */}
                                        <div className="flex flex-col sm:flex-row gap-3 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="mr-2 w-4 h-4 text-slate-700 flex-shrink-0" />
                                                <span>
                                                    Du <span className="font-medium">{formatDate(item.Date_Deb)}</span> au{" "}
                                                    <span className="font-medium">{formatDate(item.Date_fin)}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600 sm:ml-auto">
                                                <Clock className="w-4 h-4 mr-2 text-rose-500 flex-shrink-0" />
                                                <span className="font-medium">
                                                    {item.days_remaining} journée{item.days_remaining !== 1 ? "s" : ""} restante
                                                    {item.days_remaining !== 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        )
                    })
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <p className="text-slate-600">Aucune formation disponible pour le moment</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (currentPage > 1) handlePageChange(currentPage - 1)
                                }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(index + 1)
                                    }}
                                    isActive={currentPage === index + 1}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (currentPage < totalPages) handlePageChange(currentPage + 1)
                                }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
