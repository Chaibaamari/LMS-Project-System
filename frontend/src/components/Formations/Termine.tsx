
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { CheckCircle2, Search, SortAsc, SortDesc, Timer } from 'lucide-react'
import { FormationTermine } from "@/assets/modelData"
import { motion } from "framer-motion"

interface FormationsTermineProps {
  data: FormationTermine[]
}

export default function Termine({ data = [] }: FormationsTermineProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 5

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  // Filter formations based on search query
  const filteredFormations = data?.filter((formation) =>
    formation.Intitule_Action.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort formations
  const sortedFormations = [...filteredFormations].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.Intitule_Action.localeCompare(b.Intitule_Action)
    } else {
      return b.Intitule_Action.localeCompare(a.Intitule_Action)
    }
  })

  // Paginate formations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedFormations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedFormations.length / itemsPerPage)

  // Handle page change
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
            {/* Header section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="px-3 py-1.5">
                        <CheckCircle2 className="mr-1 h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium">
                            {data.length} Formation{data.length !== 1 ? "s" : ""} Terminée{data.length !== 1 ? "s" : ""}
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

            {/* Loading state */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="h-40 rounded-lg bg-gray-100 animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <>
                    {/* Formation cards */}
                    <div className="grid gap-4">
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <motion.div
                                    key={item.ID_Formation}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all "
                                >
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Image section */}
                                        <div className="relative w-full sm:w-1/4 max-w-[200px]">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                            <img
                                                src="/formationEnCoures.jpg"
                                                className="h-48 sm:h-full w-full object-cover"
                                                alt={`${item.Intitule_Action} thumbnail`}
                                            />
                                            <Badge className="absolute top-2 left-2 z-20 bg-emerald-500 hover:bg-emerald-600">
                                                Terminée
                                            </Badge>
                                        </div>

                                        {/* Content section */}
                                        <div className="flex flex-1 flex-col p-4">
                                            <div className="mb-2 flex flex-wrap gap-2">
                                                <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
                                                    <span className="text-sky-500 mr-1">■</span> Formation
                                                </Badge>
                                            </div>
                                            <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                                                {item.Intitule_Action}
                                            </h3>
                                            <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center text-muted-foreground">
                                                    <Timer className="mr-2 h-4 w-4" />
                                                    <span>Terminée</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-muted p-3 mb-4">
                                    <Search className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium mb-1">Aucune formation trouvée</h3>
                                <p className="text-muted-foreground mb-4">
                                    Aucune formation ne correspond à votre recherche.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Réinitialiser la recherche
                                </Button>
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
                </>
            )}
        </div>
    );
}
