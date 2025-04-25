"use client"

import { ChevronDown, MoreHorizontal, Clock, Star, Calendar, CheckCircle, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { FormationActions } from "@/store/Formation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/indexD"
import { getAuthToken } from "@/util/Auth"
import { Input } from "@/components/ui/input"

// Formation status types

export default function LearningDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const FormationData = useSelector((state: RootState) => state.Formation.FormationData)
  const token = getAuthToken()
  const [showAll, setShowAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const SendEmployeData = async () => {
            const response = await fetch("http://127.0.0.1:8000/api/Formation", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await response.json()
            dispatch(FormationActions.FetchDataFormation(data.formation))
            dispatch(FormationActions.ShowNotificationRefrech(false))
        }
        SendEmployeData()
    }, [dispatch, token]);

  // Display only 15 formations initially, or all if showAll is true
    const filteredFormations = FormationData?.filter(formation =>
        formation.Intitule_Action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formation.Code_Formation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formation.Mode_Formation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedFormations = showAll
        ? filteredFormations
        : filteredFormations?.slice(0, 16);

  // Function to get a random status for demo purpose

    return (
        <div className="min-h-screen">
            <header className=" bg-white">
                <div className="container flex h-16 items-center justify-between px-4 mt-6 mb-8">
                    <div className="flex items-center gap-4">
                        <img src="Sonatrach.svg" alt="" width={70} height={10} />
                        <h1 className="text-xl font-bold">Développez Vos Compétences avec Sonatrach Learning</h1>
                    </div>
                </div>
            </header>
            <main className="container px-4 py-6">
                <div className="flex items-center gap-4 flex-wrap mb-7">
                    <div className="text-sm font-bold text-slate-950">
                        {FormationData.length} Formation{FormationData.length !== 1 ? "s" : ""}
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
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {displayedFormations?.length > 0 ? (
                        displayedFormations.map((item) => {

                            return (
                                <div
                                    key={item.ID_Formation}
                                    className="group overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="relative">
                                        <div className="absolute right-2 top-2 z-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-full bg-white/80 backdrop-blur"
                                                    >
                                                        <MoreHorizontal className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                                    <DropdownMenuItem>Archive</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="absolute left-2 top-2 z-10">
                                            <Badge className="text-xs bg-primary/80">
                                                Assignment
                                                <Calendar size={10} className="ml-2" />
                                            </Badge>
                                        </div>
                                        <img src="lms2.png" className="w-full h-28 object-cover p-2" alt="Formation thumbnail" />
                                    </div>
                                    <div className="p-3 pb-0 flex flex-col justify-between gap-1 items-start">
                                        <div className="mb-1 flex items-center justify-between w-full">
                                            <Badge
                                                variant="outline"
                                                className={`${item.Mode_Formation === "PRESENTIEL" ? "text-green-400" : "text-yellow-400"}`}
                                            >
                                                {item.Mode_Formation}
                                            </Badge>
                                            <div className="">
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <Star className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <CheckCircle className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <h3 className="h-11 mb-1 text-sm font-semibold line-clamp-2">{item.Intitule_Action}</h3>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="outline">{item.Code_Formation}</Badge>
                                            </div>
                                            {/* <div className="relative h-6 w-6">
                                                <svg className="h-7 w-7" viewBox="0 0 34 34">
                                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        className="stroke-primary"
                                                        strokeWidth="3"
                                                        strokeDasharray="100"
                                                        strokeDashoffset={status === "completed" ? "0" : status === "in-progress" ? "50" : "75"}
                                                        transform="rotate(-90 18 18)"
                                                    />
                                                </svg>
                                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-medium">
                                                    {status === "completed" ? "100%" : status === "in-progress" ? "50%" : "25%"}
                                                </span>
                                            </div>*/}
                                        </div>

                                        {/* Circular progress indicator instead of linear */}
                                        <div className="flex items-baseline justify-between ">
                                            <div className="mb-3 flex items-center text-xs text-gray-500">
                                                <Clock className="mr-1 h-3 w-3" />
                                                Durée : {item.Heure_jour} journée(s)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <p className="col-span-full text-center py-8">No formations available yet</p>
                    )}
                </div>

                {/* View All button - only show if there are more than 15 formations */}
                {FormationData?.length > 15 && !showAll && (
                    <div className="flex justify-center mt-6">
                        <Button variant="outline" onClick={() => setShowAll(true)} className="flex items-center gap-2">
                            View All Formations
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Show Less button - only show if viewing all and there are more than 15 formations */}
                {showAll && FormationData?.length > 15 && (
                    <div className="flex justify-center mt-6">
                        <Button variant="outline" onClick={() => setShowAll(false)} className="flex items-center gap-2">
                            Show Less
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}



{/* // import Role from "../components/Role";
// import {Tabs, Tab, Card, CardBody} from "@heroui/react";
// import PrévisionsTotal from "../components/PrévisionsTotal";
// import Prévisions from "../components/Prévisions"; */}



{/* // export default function Home() { */}
{/* //     const tabs = [ */}
//   {
//             id: "total",
//             label: "Les Statistiques Générales",
//             content: [
//                 <Role />,
//                 <br />,
//                 <PrévisionsTotal />
//             ]
//         },
//         {
//             id: "prévision",
//             label: "Les Statistiques Des Prévisions",
//             content: 
//                 <Prévisions />
//         },
//     ];
    
//     return (
//         <div className="flex w-full flex-col">
//             <Tabs aria-label="Dynamic tabs" items={tabs} color="secondary" radius="full">
//                 {(item) => (
//                     <Tab key={item.id} title={item.label}>
//                         <Card>
//                             <CardBody>{item.content}</CardBody>
//                         </Card>
//                     </Tab>
//                 )}
//             </Tabs>
//         </div>
//     );
// }