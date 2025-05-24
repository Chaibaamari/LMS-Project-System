"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { cn } from "@/lib/utils"
import { CardHeader, CardTitle} from "@/components/ui/card"
import { CalendarIcon} from "lucide-react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/indexD"
import { FormationActions } from "@/store/Formation"

interface YearSelectorProps {
  onYearChange?: (year: number) => void
  className?: string
}

const YearSelector = ({ onYearChange, className }: YearSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const stored = localStorage.getItem("selectedYear")
    return stored ? new Date(Number.parseInt(stored), 0, 1) : new Date()
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    localStorage.setItem("selectedYear", selectedDate.getFullYear().toString());
    if (onYearChange) {
      onYearChange(selectedDate.getFullYear());
    }
  }, [selectedDate, onYearChange]);
  
  useEffect(() => {
    dispatch(
      FormationActions.ShowNotification({
        IsVisible: true,
        status: "success",
        message: `Année ${selectedDate.getFullYear()} sélectionnée avec succès`,
      })
    );
    dispatch(FormationActions.ReferchLatestData(true));
  }, [selectedDate, dispatch]); // Only runs when `selectedDate` changes

  return (
    <div className={cn("w-full max-w-md ", className)}>
        <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-slate-700">Selectionée année de travail</CardTitle>
      </CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <DatePicker
                  id="year-picker"
                  selected={selectedDate}
                  onChange={(date) => {
                    if (date) {
                      setSelectedDate(date)
                    }
                  }}
                  showYearPicker
                  dateFormat="yyyy"
                  className={cn(
                    "w-full px-3 py-2 text-sm border border-input bg-background rounded-md shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
                    "pl-10", // Space for the calendar icon
                  )}
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default YearSelector
