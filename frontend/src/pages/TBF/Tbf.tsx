"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/indexD"
import ContractCard from "@/components/Tables/TBF"
import { getAuthToken, getYearExercice } from "@/util/Auth"
import { TBFActions } from "@/store/TBF"
import { useEffect, useState } from "react"
import NotificationError from "@/components/Error/NotificationError"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, RefreshCw, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function Tbf() {
  const TBFdata = useSelector((state: RootState) => state.TBF.TBFData)
  const token = getAuthToken()
  const dispatch = useDispatch()
  const refrechData = useSelector((state: RootState) => state.TBF.refrechData)
  const IsLoading = useSelector((state: RootState) => state.TBF.IsLoading)
  const { IsVisible, status, message } = useSelector((state: RootState) => state.TBF.Notification)

  // Add state for year filtering
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [filteredData, setFilteredData] = useState(TBFdata)
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const stored = localStorage.getItem('selectedYear');

  // Get unique years from TBF data
    const getUniqueYears = () => {
        const years = TBFdata.map(item => {
            const dateParts = item.date_creation.split('/');
            return parseInt(dateParts[2]); // Extrait l'année du format "dd/mm/yyyy"
        });
        return [...new Set(years)].sort((a, b) => b - a) // Sort years in descending order
    };
    useEffect(() => {
        const SendEmployeData = async () => {
            dispatch(TBFActions.ShowNotificationRefrech(true))
            const response = await fetch("http://127.0.0.1:8000/api/TBF", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    "Year": stored ?? '',
                },
            })
            const data = await response.json()
            dispatch(TBFActions.FetchDataTBF(data.TBF))
            dispatch(TBFActions.ShowNotificationRefrech(false))
        }
        SendEmployeData()
    }, [dispatch, token, refrechData]);

    useEffect(() => {
        if (IsVisible) {
            setTimeout(() => {
                dispatch(TBFActions.ClearNotification())
            }, 5000)
        }
    }, [dispatch, IsVisible]);

  // Filter data when TBFdata or selectedYear changes
  useEffect(() => {
    if (selectedYear) {
      const filtered = TBFdata.filter((item) => {
        const itemYear = item.date_creation.split("/")[2] // Assuming date format is "dd/mm/yyyy"
        return itemYear.toString() === selectedYear.toString()
      })
      setFilteredData(filtered)
    } else {
      setFilteredData(TBFdata)
    }
  }, [TBFdata, selectedYear])

  // Handle year selection
    const handleYearChange = (year: string) => {
        setSelectedYear(year)
    };

  // Reset filter
    const resetFilter = () => {
        setSelectedYear("")
    };

  // Handle refresh
    const handleRefresh = () => {
        // dispatch(TBFActions.ReferchLatestData(true))
    };

    return (
        <div className="container mx-auto py-6">
            {IsLoading ? (
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center mb-8">
                        <div className="flex items-center mb-4 md:mb-0">
                            <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                        </div>
                        <div className="text-center md:text-start font-raleway">
                            <h1 className="text-3xl md:text-3xl font-bold text-[#F7913D] tracking-tight">
                                BILAN {getYearExercice()}
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-4 mt-6">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col md:flex-row items-center mb-8">
                                <div className="flex items-center mb-4 md:mb-0">
                                    <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                                </div>
                                <div className="text-center md:text-start font-raleway">
                                    <h1 className="text-3xl md:text-3xl font-bold text-[#F7913D] tracking-tight">
                                        BILAN {getYearExercice()}
                                    </h1>
                                </div>
                            </div>
                            <div>{selectedYear && (
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-2">Filtré par année: {selectedYear}</span>
                                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={resetFilter}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}</div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                            <Button variant="outline" size="icon" title="Rafraîchir" onClick={handleRefresh}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        title="Filtrer par année"
                                        className={selectedYear ? "border-blue-500 text-blue-500" : ""}
                                    >
                                        <Filter className="h-4 w-4" />
                                        
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-3">
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Filtrer par année</h4>
                                        <Select value={selectedYear} onValueChange={handleYearChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une année" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getUniqueYears().map((year) => (
                                                    <SelectItem key={year} value={year.toString()}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {selectedYear && (
                                            <Button variant="outline" size="sm" className="w-full mt-2" onClick={resetFilter}>
                                                Réinitialiser
                                            </Button>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <ContractCard data={filteredData} />
                    </div>
                </>
            )}
            <NotificationError isVisible={IsVisible} status={status} message={message} />
        </div>
    );
}
