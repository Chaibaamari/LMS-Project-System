"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, FileUp, FileDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ExcelProps {
  importPrevData: (file: File) => Promise<void>
  exportPrevData?: () => Promise<void>
  importNotifieData?: (file: File) => Promise<void>
  exportNotifieData?: () => Promise<void>
}

export default function ImportExportComponent({
  importPrevData,
  exportPrevData,
  importNotifieData,
  exportNotifieData,
}: ExcelProps) {
    const [prevFile, setPrevFile] = useState<File | null>(null);
    const [notifieFile, setNotifieFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeImport, setActiveImport] = useState<"prev" | "notifie" | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const handleFileImport = async (type: "prev" | "notifie") => {
        const file = type === "prev" ? prevFile : notifieFile
        const importFunction = type === "prev" ? importPrevData : importNotifieData

        if (!file || !importFunction) return

        try {
            setLoading(true)
            setActiveImport(type)
            await importFunction(file)
            if (type === "prev") {
                setPrevFile(null);
            } else {
                setNotifieFile(null);
            }
        } catch (error) {
            console.log("Import Error:",error)
        } finally {
            setLoading(false)
            setActiveImport(null)
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "prev" | "notifie") => {
        const file = e.target.files?.[0] || null;
        if (type === "prev") {
            setPrevFile(file);
        } else {
            setNotifieFile(file);
        }
        // Keep dropdown open after file selection
        e.stopPropagation();
    };
    return (
        <div className="flex items-center gap-2" ref={dropdownRef}>
            <DropdownMenu>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <FileUp className="h-4 w-4" />
                                    <span>Import/Export</span>
                                </Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Import or export data</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent align="end" className="w-56" onInteractOutside={(e) => {
                    // Prevent dropdown from closing when interacting with file inputs
                    if (dropdownRef.current?.contains(e.target as Node)) {
                        e.preventDefault();
                    }
                }}>
                    {/* PV Data Import */}
                    <DropdownMenuItem
                        className="flex flex-col items-start w-full"
                        onSelect={(e) => e.preventDefault()}>
                        <span className="font-medium mb-1">Import PV Data</span>
                        <div className="flex items-center gap-2 w-full">
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => handleFileChange(e, "prev")}
                                className="hidden"
                                id="prev-file-upload"
                            />
                            <label
                                htmlFor="prev-file-upload"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1 cursor-pointer flex-1"
                            >
                                {prevFile ? prevFile.name.substring(0, 15) + "..." : "Choose File"}
                            </label>
                            <Button
                                onClick={() => handleFileImport("prev")}
                                disabled={!prevFile || (loading && activeImport === "prev")}
                                size="sm"
                                className="h-8"
                            >
                                {loading && activeImport === "prev" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Upload className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </DropdownMenuItem>

                    {/* PV Data Export */}
                    {exportPrevData && (
                        <DropdownMenuItem onClick={exportPrevData} disabled={loading} className="cursor-pointer">
                            <FileDown className="h-4 w-4 mr-2" />
                            <span>Export PV Data</span>
                        </DropdownMenuItem>
                    )}

                    {/* Notifie Data Import */}
                    {importNotifieData && (
                        <DropdownMenuItem className="flex flex-col items-start w-full">
                            <span className="font-medium mb-1">Import Notifie Data</span>
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => {
                                        setNotifieFile(e.target.files ? e.target.files[0] : null)
                                    }}
                                    className="hidden"
                                    id="notifie-file-upload"
                                />
                                <label
                                    htmlFor="notifie-file-upload"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1 cursor-pointer flex-1"
                                >
                                    {notifieFile ? notifieFile.name.substring(0, 15) + "..." : "Choose File"}
                                </label>
                                <Button
                                    onClick={() => handleFileImport("notifie")}
                                    disabled={!notifieFile || (loading && activeImport === "notifie")}
                                    size="sm"
                                    className="h-8"
                                >
                                    {loading && activeImport === "notifie" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </DropdownMenuItem>
                    )}

                    {/* Notifie Data Export */}
                    {exportNotifieData && (
                        <DropdownMenuItem onClick={exportNotifieData} disabled={loading} className="cursor-pointer">
                            <FileDown className="h-4 w-4 mr-2" />
                            <span>Export Notifie Data</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Show selected file name outside dropdown when a file is selected */}
            {prevFile && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">{prevFile.name}</span>
                    <Button
                        onClick={() => handleFileImport("prev")}
                        disabled={loading && activeImport === "prev"}
                        size="sm"
                        variant="secondary"
                    >
                        {loading && activeImport === "prev" ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            "Import PV Data"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

