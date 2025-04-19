"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateRangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedAction: string | null
  onSubmit: (startDate: Date, endDate: Date) => void
}

export function DateRangeDialog({ open, onOpenChange, selectedAction, onSubmit }: DateRangeDialogProps) {
  const [dateRange, setDateRange] = useState<{
    startDate: Date | undefined
    endDate: Date | undefined
  }>({
    startDate: undefined,
    endDate: undefined,
  })

  const handleSubmit = () => {
    if (dateRange.startDate && dateRange.endDate) {
      onSubmit(dateRange.startDate, dateRange.endDate)
    }
  }

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                if (!newOpen) {
                    // Reset date range when dialog closes
                    setDateRange({ startDate: undefined, endDate: undefined })
                }
                onOpenChange(newOpen)
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer un Bon de Commande</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="action">Action de Formation</Label>
                        <Input id="action" value={selectedAction || ""} readOnly />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date-debut">Date de début</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date-debut"
                                    variant="outline"
                                    className={cn("justify-start text-left font-normal", !dateRange.startDate && "text-muted-foreground")}
                                >
                                    {dateRange.startDate
                                        ? format(dateRange.startDate, "dd MMMM yyyy", { locale: fr })
                                        : "Sélectionner une date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateRange.startDate}
                                    onSelect={(date) => setDateRange((prev) => ({ ...prev, startDate: date }))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date-fin">Date de fin</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date-fin"
                                    variant="outline"
                                    className={cn("justify-start text-left font-normal", !dateRange.endDate && "text-muted-foreground")}
                                >
                                    {dateRange.endDate
                                        ? format(dateRange.endDate, "dd MMMM yyyy", { locale: fr })
                                        : "Sélectionner une date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateRange.endDate}
                                    onSelect={(date) => setDateRange((prev) => ({ ...prev, endDate: date }))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit} disabled={!dateRange.startDate || !dateRange.endDate}>
                        Créer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
