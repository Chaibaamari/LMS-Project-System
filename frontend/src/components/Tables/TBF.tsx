import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Folder, MoreHorizontal } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import type { TBF } from "@/assets/modelData"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/indexD"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"

interface ContractCardProps {
  data: TBF[]
}

// Function to get folder color based on month
const getFolderColor = (dateString: string) => {

const month = dateString.split('/')[1]

const colors = [
    "text-red-500",
    "text-pink-500",
    "text-purple-500",
    "text-indigo-500",
    "text-blue-500",
    "text-cyan-500",
    "text-teal-500",
    "text-green-500",
    "text-lime-500",
    "text-yellow-500",
    "text-amber-500",
    "text-orange-500",
  ]

  return colors[Number(month) - 1] || "text-gray-500"
}

export default function ContractCard({ data = [] }: ContractCardProps) {
    const User = useSelector((state: RootState) => state.BondCommand.User)

if (data.length === 0) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Folder className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucun TBF trouvé</h3>
            <p className="text-sm text-gray-500 mt-2">Il n'y a pas de TBF disponible pour cette période.</p>
        </div>
    );
    };

    return (
        <>
            {data.map((item, index) => (
                <Card key={index} className="bg-white hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Folder className={`h-6 w-6 ${getFolderColor(item.date_creation)}`} />
                                <CardTitle className="text-lg !mt-0 truncate">{item.Nom}</CardTitle>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link to={`/homePage/TBF/bondCommand/${item.date_creation.split('/')[1]}`} className="w-full">
                                    <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                                    <DropdownMenuItem>Télécharger</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>{item.date_creation}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="h-4 w-4" />
                                <span>{User.name}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <div className="flex justify-between items-center w-full">
                            <Badge variant="outline" className="text-xs">
                                {item.date_creation.split('/')[1]}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                                <FileText className="h-4 w-4 mr-1" />
                                Ouvrir
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
}
