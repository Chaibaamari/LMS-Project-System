"use client"

import { ChevronDown, MoreHorizontal, Clock, Star, Calendar, CheckCircle, ChevronRight, Search, ClockArrowUp, CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { FormationActions } from "@/store/Formation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/indexD"
import { getAuthToken } from "@/util/Auth"
import { Input } from "@/components/ui/input"
import  TabChange from "@/components/Tools/TabsChange"
import EnCours from "@/components/Formations/EnCours"
import Termine from "@/components/Formations/Termine"
import YearSelector from "@/components/YearSelect/YearSelector"
import NotificationError from "@/components/Error/NotificationError"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { OrganismeActions } from "@/store/Organisme"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
// Formation status types

export default function Formation() {
    const dispatch = useDispatch<AppDispatch>(); 
    const navigate = useNavigate();
    const {IsVisible , status , message} = useSelector((state : RootState) => state.Formation.Notification)
    const FormationData = useSelector((state: RootState) => state.Formation.FormationData);
    const FormationDataEnCours = useSelector((state: RootState) => state.Formation.FormationEnCours);
    const FormationDataTermine = useSelector((state: RootState) => state.Formation.FormationTermine);
    const token = getAuthToken();
    const [showAll, setShowAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const permission = useSelector((state: RootState) => state.BondCommand.User)
    const [showDateRangeDialog, setShowDateRangeDialog] = useState(false);
    
    const Organisme = useSelector((state: RootState) => state.Organisme.ListeOrganisme || []);
    const [editFormData, setEditFormData] = useState({
        Intitule_Action: '',
        Id_Organisme: 0,
        Mode_Formation: '',
        Domaine_Formation: '',
        Code_Domaine_Formation: '',
        Niveau_Formation: '',
        Nature_Formation: '',
        Source_Besoin: '',
        Type_Formation: '',
        Code_Formation: '',
        Heure_jour: 0,
    });
    useEffect(() => {
        const fetchAllFormation = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/Formation/organisme", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json',
                        "Authorization": `Bearer ${token}`,
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                dispatch(OrganismeActions.GetAllOrganisme(data.Organisme));
            } catch (error) {
                console.error("Error fetching formations:", error);
            }
        }
        
        fetchAllFormation();
    }, [token, dispatch]);
    
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
    }, [token , dispatch]);
    

    useEffect(() => {
        const SendEmployeData = async () => {
            const response = await fetch("http://127.0.0.1:8000/api/formation-etat", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await response.json()
            dispatch(FormationActions.FetchDataFormationEnCours(data.enCour))
            dispatch(FormationActions.FetchDataFormationTermine(data.termine))
            dispatch(FormationActions.ShowNotificationRefrech(false))
        }
        SendEmployeData()
    }, [token , dispatch]);

    useEffect(() => {
        if (IsVisible) {
            setTimeout(() => {
                dispatch(FormationActions.ClearNotification());
            }, 5000)
        }
    }, [dispatch, IsVisible]);
    
    const openDateRangeDialog = () => {
        setShowDateRangeDialog(true);
    }
    
    const handleSubmit = async () => {
    
        try {
            console.log(editFormData)
            const response = await fetch("http://127.0.0.1:8000/api/Formation/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(editFormData)
            });
    
            if (!response.ok) {
                dispatch(
                    FormationActions.ShowNotification({
                        IsVisible: true,
                        status: "failed",
                        message: `Erreur lors de la création de la formation. Veuillez réessayer.`,
                    })
                );
                setShowDateRangeDialog(false);
                dispatch(FormationActions.ReferchLatestData(true))
                return navigate('/homePage');
            }
            dispatch(
                FormationActions.ShowNotification({
                    IsVisible: true,
                    status: "success",
                    message: `Nouvelle formation ajoutée avec succès.`,
                })
            );
            setShowDateRangeDialog(false);
            return navigate('/homePage');
        } catch (error) {
            console.error("Error creating formation:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
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
                    <div className="w-64">
                        <YearSelector
                        // onYearChange={(year) => console.log(`Year changed to: ${year}`)}
                        />
                    </div>
                </div>
            </header>
            <main className="container px-4 py-6">
                <TabChange
                    tabs={[
                        {
                            label: "Formations",
                            content: (
                                <>
                                    
                                    <div className="flex  justify-between">
                                        <div className="flex items-center gap-4 flex-wrap mb-7">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary" className="px-3 py-1.5">
                                                    <ClockArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                                                    <span className="text-sm font-medium">
                                                        {FormationData.length} Formation{FormationData.length !== 1 ? "s" : ""}
                                                    </span>
                                                </Badge>
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
                                        <div>
                                            {(permission.role === "responsable" || permission.role === "gestionnaire") && (
                                                <Button
                                                    variant="outline"
                                                    onClick={openDateRangeDialog}
                                                    className="font-raleway  "
                                                >
                                                    <CirclePlus />
                                                    Ajouter une formation
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                                        {displayedFormations?.length > 0 ? (
                                            displayedFormations.map((item, index) => {

                                                return (
                                                    <div
                                                        key={index}
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
                                </>
                            )
                        },
                        {
                            label: "Formation en cours",
                            content: <EnCours
                                data={FormationDataEnCours}
                            />
                        },
                        {
                            label: "Formation terminé",
                            content: <Termine
                                data={FormationDataTermine}
                            />
                        },
                    ]}
                />
            </main>
            <NotificationError
                isVisible={IsVisible}
                status={status}
                message={message}
            />
            <Dialog open={showDateRangeDialog} onOpenChange={setShowDateRangeDialog}>
                <DialogContent className="sm:max-w-[765px]">
                    <DialogHeader>
                        <DialogTitle>Créer une nouvelle formation</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground whitespace-nowrap">
                            Veuillez confirmer les informations avant de continuer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mt-2">
                            <div className="mb-2">
                                <Label htmlFor="action" className="mb-2">Intitule de Formation</Label>
                                <Input id="action"
                                    name="Intitule_Action"
                                    onChange={handleInputChange}
                                    value={editFormData.Intitule_Action}
                                />
                            </div>
                            <div className="mb-2">
                                <Label htmlFor="action" className="mb-2">Domaine de formation</Label>
                                <Input id="action"
                                    type="text"
                                    name="Domaine_Formation"
                                    onChange={handleInputChange}
                                    value={editFormData.Domaine_Formation}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="mb-2">
                                <Label htmlFor="action" className="mb-2">Code domaine de formation</Label>
                                <Input id="action"
                                    name="Code_Domaine_Formation"
                                    onChange={handleInputChange}
                                    value={editFormData.Code_Domaine_Formation}
                                />
                            </div>
                            <div className="mb-2">
                                <Label htmlFor="action" className="mb-2">Niveau de formation</Label>
                                <Input id="action"
                                    type="text"
                                    name="Niveau_Formation"
                                    onChange={handleInputChange}
                                    value={editFormData.Niveau_Formation}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="mb-2">
                                <Label htmlFor="action" className="mb-2">Nature de formation</Label>
                                <Input id="action"
                                    name="Nature_Formation"
                                    onChange={handleInputChange}
                                    value={editFormData.Nature_Formation}
                                />
                            </div>
                            <div className="mb-2">
                                <Label htmlFor="action" className="mb-2">Source besoin</Label>
                                <Input id="action"
                                    type="text"
                                    name="Source_Besoin"
                                    onChange={handleInputChange}
                                    value={editFormData.Source_Besoin}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="mb-2">
                                <Label htmlFor="action" className="mb-2">Type de formation</Label>
                                <Input id="action"
                                    name="Type_Formation"
                                    onChange={handleInputChange}
                                    value={editFormData.Type_Formation}
                                />
                            </div>
                            <div className="mb-2">
                                <Label htmlFor="action" className="mb-2">Mode de formation</Label>
                                <Input id="action" type="text"
                                    name="Mode_Formation"
                                    onChange={handleInputChange}
                                    value={editFormData.Mode_Formation}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="mb-2">
                                <Label htmlFor="action" className="mb-2">Code de formation</Label>
                                <Input id="action" name="Code_Formation"
                                    onChange={handleInputChange}
                                    value={editFormData.Code_Formation}
                                />
                            </div>
                            <div className="mb-2">
                                <Label htmlFor="action" className="mb-2">Heur&Jour</Label>
                                <Input id="action" type="text" name="Heure_jour"
                                    onChange={handleInputChange}
                                    value={editFormData.Heure_jour}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="mb-2">
                                <Label htmlFor="Id_Organisme" className="mb-2">Organisme</Label>
                                <Select
                                    name="Id_Organisme"
                                    value={editFormData.Id_Organisme?.toString() || ""}
                                    onValueChange={(value) => {
                                        setEditFormData(prev => ({
                                            ...prev,
                                            Id_Organisme: Number(value) // Convert string value back to number
                                        }));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un organisme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Organisme.map((org , index) => (
                                            <SelectItem key={index} value={org.value.toString()}>
                                                {org.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDateRangeDialog(false)}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSubmit}
                        // disabled={!dateRange.startDate || !dateRange.endDate}
                        >
                            Créer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}


