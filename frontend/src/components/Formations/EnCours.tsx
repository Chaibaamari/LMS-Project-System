"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, Search, Users, Timer } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"


interface FormationEnCours {
  ID_Formation: number
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
  }

  const [searchQuery, setSearchQuery] = useState("")
  const filteredFormations = data?.filter((formation) =>
    formation.Intitule_Action.toLowerCase().includes(searchQuery.toLowerCase()),
  )



  // Get completion status
  const getCompletionStatus = (percentage: number) => {
    if (percentage === 0) return { label: "Non commencé", color: "text-slate-500" }
    if (percentage < 25) return { label: "Démarrage", color: "text-blue-500" }
    if (percentage < 50) return { label: "En cours", color: "text-amber-500" }
    if (percentage < 75) return { label: "Avancé", color: "text-indigo-500" }
    if (percentage < 100) return { label: "Presque terminé", color: "text-emerald-500" }
    return { label: "Terminé", color: "text-green-600" }
  }

    return (
        <>

            <div className="flex items-center gap-4 flex-wrap mb-7">
                <div className="text-sm font-bold text-slate-950 font-raleway">
                    {data.length} Formation{data.length !== 1 ? "s" : ""} pratique d'exécution
                </div>
                <div className="h-7 w-px bg-muted-foreground/30" />
                <div className="relative">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8 w-[200px] md:w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1">
                {filteredFormations?.length > 0 ? (
                    filteredFormations.map((item) => {
                        const status = getCompletionStatus(item.pourcentage)
                        const startDate = new Date(item.Date_Deb)
                        const endDate = new Date(item.Date_fin)
                        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                        const completedDays = totalDays - item.days_remaining

                        return (
                            <div
                                key={item.ID_Formation}
                                className="flex flex-col items-center sm:flex-row overflow-hidden rounded-lg border bg-white transition-all"
                            >
                                {/* Image section */}
                                <div className="relative w-full sm:w-1/4 max-w-[200px]">
                                    <img
                                        src="formationEnCoures.jpg"
                                        className="w-full h-36 object-cover"
                                        alt={`${item.Intitule_Action} thumbnail`}
                                    />
                                    <div
                                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-white ${status.color}`}
                                    >
                                        {status.label}
                                    </div>
                                </div>

                                {/* Content section */}
                                <div className="px-4 py-3">
                                    <div className="flex items-center mb-1">
                                        <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 mr-2">
                                            <span className="text-sky-500 mr-1">■</span> formation
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 line-clamp-1">{item.Intitule_Action}</h3>
                                </div>

                                <div className="flex-1 flex-row p-4">
                                    {/* Progress section */}
                                    <div className="mt-4 mb-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-gray-500">Progression</span>
                                            <span className="text-xs font-medium">{item.pourcentage}%</span>
                                        </div>
                                        <Progress value={item.pourcentage} className="h-2" />
                                    </div>

                                    {/* Enhanced statistics */}
                                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-1 text-slate-700" />
                                            <span className="text-gray-600">
                                                Jours complétés: {completedDays}/{totalDays}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Timer className="w-4 h-4 mr-1 text-slate-700" />
                                            <span className="text-gray-600">Temps estimé: {totalDays} jours</span>
                                        </div>
                                    </div>

                                    {/* Date information */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 mb-2">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar className="mr-1 w-5 h-5 text-slate-900" />
                                            <span>
                                                Du {formatDate(item.Date_Deb)} au {formatDate(item.Date_fin)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="w-5 h-5 mr-2 text-rose-500" />
                                        <span>
                                            {item.days_remaining} journée{item.days_remaining !== 1 ? "s" : ""} restante
                                            {item.days_remaining !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-center py-8">Aucune formation disponible pour le moment</p>
                )}
            </div>
        </>
    );
}
