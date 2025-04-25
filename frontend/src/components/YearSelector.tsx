"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, RefreshCw, RotateCcw, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface YearSelectorProps {
  onYearChange?: (year: number) => void
  className?: string
}

const YearSelector = ({ onYearChange, className }: YearSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const stored = localStorage.getItem("selectedYear")
    return stored ? new Date(Number.parseInt(stored), 0, 1) : new Date()
  })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [recordCount, setRecordCount] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchRecords = async () => {
    try {
      setIsLoading(true)
      setStatus("idle")

      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/api/records", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          Year: selectedDate.getFullYear().toString(),
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Fetched Records:", data)
      setRecordCount(Array.isArray(data) ? data.length : null)
      setStatus("success")

      toast({
        title: "Records fetched successfully",
        description: `Found ${Array.isArray(data) ? data.length : "multiple"} records for ${selectedDate.getFullYear()}`,
        variant: "default",
      })

      return data
    } catch (error) {
      console.error("Fetch failed:", error)
      setStatus("error")

      toast({
        title: "Failed to fetch records",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })

      return []
    } finally {
      setIsLoading(false)
    }
  }

  const resetToCurrentYear = () => {
    const currentYear = new Date()
    setSelectedDate(currentYear)
    setStatus("idle")
    setRecordCount(null)

    toast({
      title: "Reset to current year",
      description: `Year set to ${currentYear.getFullYear()}`,
    })
  }

  useEffect(() => {
    localStorage.setItem("selectedYear", selectedDate.getFullYear().toString())
    if (onYearChange) {
      onYearChange(selectedDate.getFullYear())
    }
  }, [selectedDate, onYearChange])

  return (
    <Card className={cn("w-full max-w-md ", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Working Year Selection
        </CardTitle>
        <CardDescription>Select a year to view and manage records</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="year-picker" className="text-sm font-medium">
              Selected Year
            </Label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <DatePicker
                  id="year-picker"
                  selected={selectedDate}
                  onChange={(date) => {
                    if (date) {
                      setSelectedDate(date)
                      setStatus("idle")
                      setRecordCount(null)
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

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={resetToCurrentYear}
                      className="h-10 w-10 flex-shrink-0"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset to current year</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {status === "success" && recordCount !== null && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span>
                Found {recordCount} records for {selectedDate.getFullYear()}
              </span>
              <Badge
                variant="outline"
                className="ml-auto bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                Success
              </Badge>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>Failed to fetch records for {selectedDate.getFullYear()}</span>
              <Badge variant="outline" className="ml-auto bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                Error
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button onClick={fetchRecords} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching Records...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Fetch Records for {selectedDate.getFullYear()}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default YearSelector
