"use client"

import type React from "react"
import { useState } from "react"
import { Form, useNavigation, Link } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, CalendarIcon } from "lucide-react"
import type { PlanPrevision } from "@/assets/modelData"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DynamicInsertFormProps<T extends Record<string, unknown>> {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    editFormData: T;
    handleInputChange: <K extends keyof T>(name: K, value: T[K]) => void;
    fields: Array<{
        type: "input" | "select" | "date" | "number"
        name: keyof PlanPrevision
        label: string
        placeholder?: string
        options?: { value: string; label: string }[]
        errorMessage?: string
    }>;
    UrlRelaod: string;
}

// Custom calendar component with year navigation
function CustomCalendar({
    selected,
    onSelect,
}: {
        selected?: Date;
        onSelect: (date: Date | undefined) => void;
}) {
    const [calendarDate, setCalendarDate] = useState<Date>(selected || new Date());
    const currentYear = new Date().getFullYear();

  // Generate years for dropdown (100 years back from current)
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Generate all months
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const handleYearChange = (year: string) => {
        const newDate = new Date(calendarDate)
        newDate.setFullYear(Number.parseInt(year))
        setCalendarDate(newDate)
    };

    const handleMonthChange = (monthIndex: number) => {
        const newDate = new Date(calendarDate)
        newDate.setMonth(monthIndex)
        setCalendarDate(newDate)
    };

    return (
        <div className="p-3">
            <div className="flex justify-between items-center mb-4">
                <div className="grid grid-cols-2 gap-2 w-full">
                    {/* Month selector */}
                    <Select
                        value={calendarDate.getMonth().toString()}
                        onValueChange={(value) => handleMonthChange(Number.parseInt(value))}
                    >
                        <SelectTrigger className="h-8">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month, index) => (
                                <SelectItem key={month} value={index.toString()}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Year selector */}
                    <Select value={calendarDate.getFullYear().toString()} onValueChange={handleYearChange}>
                        <SelectTrigger className="h-8">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Calendar
                mode="single"
                selected={selected}
                onSelect={onSelect}
                month={calendarDate}
                onMonthChange={setCalendarDate}
                initialFocus
                className="rounded-md border"
            />
        </div>
    );
}

export function DynamicInsertForm<T extends Record<string, unknown>>({
    handleSubmit,
    editFormData,
    handleInputChange,
    fields,
    UrlRelaod,
}: DynamicInsertFormProps<T>) {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

    const markFieldAsTouched = (fieldName: string) => {
        setTouchedFields((prev) => {
            const newSet = new Set(prev)
            newSet.add(fieldName)
            return newSet
        })
    };

    const isFieldTouched = (fieldName: string) => touchedFields.has(fieldName);

    const getErrorMessage = (field: (typeof fields)[0]) => {
        if (field.errorMessage) {
            return field.errorMessage
        }
        return `Please enter a valid ${field.label.toLowerCase()}`
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6">
            <Card className="transition-all duration-200 shadow-md hover:shadow-lg">
                <CardHeader className="space-y-1 pb-6 border-b">
                    <CardTitle className="text-2xl font-bold text-center sm:text-left">Employee Information</CardTitle>
                    <CardDescription className="text-muted-foreground">Enter employee details in the form below</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Form method="post" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                {fields.map((field) => (
                                    <div key={field.name} className="space-y-2 group">
                                        <Label
                                            htmlFor={field.name.toString()}
                                            className="font-medium group-hover:text-primary transition-colors"
                                        >
                                            {field.label}
                                        </Label>
                                        {field.type === "input" && (
                                            <>
                                                <Input
                                                    id={field.name.toString()}
                                                    name={field.name.toString()}
                                                    required
                                                    value={editFormData[field.name] as string}
                                                    onChange={(e) => handleInputChange(field.name.toString(), e.target.value as T[keyof T])}
                                                    className={`transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${!editFormData[field.name] && isFieldTouched(field.name.toString())
                                                            ? "border-red-500 focus:ring-red-200"
                                                            : ""
                                                        }`}
                                                    placeholder={field.placeholder}
                                                    onBlur={() => markFieldAsTouched(field.name.toString())}
                                                />
                                                {!editFormData[field.name] && isFieldTouched(field.name.toString()) && (
                                                    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <span>{getErrorMessage(field)}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {field.type === "select" && (
                                            <>
                                                <Select
                                                    value={editFormData[field.name] as string}
                                                    onValueChange={(value) => handleInputChange(field.name.toString(), value as T[keyof T])}
                                                >
                                                    <SelectTrigger
                                                        id={field.name.toString()}
                                                        className={`transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${!editFormData[field.name] && isFieldTouched(field.name.toString())
                                                                ? "border-red-500 focus:ring-red-200"
                                                                : ""
                                                            }`}
                                                        onBlur={() => markFieldAsTouched(field.name.toString())}
                                                    >
                                                        <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.options?.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {!editFormData[field.name] && isFieldTouched(field.name.toString()) && (
                                                    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <span>{getErrorMessage(field)}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {field.type === "date" && (
                                            <>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id={field.name.toString()}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !editFormData[field.name] && "text-muted-foreground",
                                                                !editFormData[field.name] && isFieldTouched(field.name.toString()) && "border-red-500",
                                                            )}
                                                            onClick={() => markFieldAsTouched(field.name.toString())}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {editFormData[field.name] ? (
                                                                format(new Date(editFormData[field.name] as string), "PPP")
                                                            ) : (
                                                                <span>{field.placeholder || `Select ${field.label}`}</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <CustomCalendar
                                                            selected={
                                                                editFormData[field.name] ? new Date(editFormData[field.name] as string) : undefined
                                                            }
                                                            onSelect={(date) => {
                                                                if (date) {
                                                                    const formattedDate = format(date, "yyyy-MM-dd")
                                                                    handleInputChange(field.name.toString(), formattedDate as T[keyof T])
                                                                }
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <input
                                                    type="hidden"
                                                    name={field.name.toString()}
                                                    value={(editFormData[field.name] as string) || ""}
                                                />
                                                {!editFormData[field.name] && isFieldTouched(field.name.toString()) && (
                                                    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <span>{getErrorMessage(field)}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {field.type === "number" && (
                                            <>
                                                <Input
                                                    id={field.name.toString()}
                                                    name={field.name.toString()}
                                                    type="number"
                                                    value={editFormData[field.name] as string}
                                                    onChange={(e) => handleInputChange(field.name.toString(), e.target.value as T[keyof T])}
                                                    className={`transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${!editFormData[field.name] && isFieldTouched(field.name.toString())
                                                            ? "border-red-500 focus:ring-red-200"
                                                            : ""
                                                        }`}
                                                    onBlur={() => markFieldAsTouched(field.name.toString())}
                                                />
                                                {!editFormData[field.name] && isFieldTouched(field.name.toString()) && (
                                                    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <span>{getErrorMessage(field)}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                            <Link to={`${UrlRelaod}`}>
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="transition-all duration-200 hover:bg-muted w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                {isSubmitting ? "Saving..." : "Save changes"}
                            </Button>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

