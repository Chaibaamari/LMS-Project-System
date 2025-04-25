
// //     // const [Directions, setDirections] = useState([]);
// //     // const [isLoading, setIsLoading] = useState(false);
// //     // const [Error , setError] = useState(null)

// //     // const token = getAuthToken();
// //     // useEffect(() => {
// //     //     setIsLoading(true);
// //     //     const fetchData = async () => {
// //     //         const response = await fetch("http://127.0.0.1:8000/api/directions", {
// //     //             method: "GET",
// //     //             headers: {
// //     //                 "Content-Type": "application/json",
// //     //                 'Accept': 'application/json',
// //     //                 "Authorization": `Bearer ${token}` // Include the token in the request
// //     //             }
// //     //         });
// //     //         const data = await response.json();
// //     //         setDirections(data.directions);
// //     //         return data.employes;
// //     //     };

        
// //     //     fetchData();
// //     //     setIsLoading(false)
// //     // }, [token]);

// // // import EnhancedRole from "@/components/Role"
// // // import EnhancedPrévisionsTotal from "@/components/PrévisionsTotal"
// // // import EnhancedPrévisions from "@/components/Prévisions"
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
// // // import { Card, CardContent } from "@/components/ui/card"
// // import { Calendar } from "@/components/ui/calendar"
// // import { useState } from "react"

// // export default function Direction() {
// //     const [date, setDate] = useState<Date | undefined>(new Date())
// //     return (
// //         // <div className="flex w-full flex-col">
// //         //     <Tabs defaultValue="total" className="w-full">
// //         //         <TabsList className="grid w-full grid-cols-2">
// //         //             <TabsTrigger value="total">Les Statistiques Générales</TabsTrigger>
// //         //             <TabsTrigger value="prévision">Les Statistiques Des Prévisions</TabsTrigger>
// //         //         </TabsList>
// //         //         <TabsContent value="total">
// //         //             <Card>
// //         //                 <CardContent className="pt-6">
// //         //                     <div className="grid gap-6 md:grid-cols-2">
// //         //                         <EnhancedRole />
// //         //                         <EnhancedPrévisionsTotal />
// //         //                     </div>
// //         //                 </CardContent>
// //         //             </Card>
// //         //         </TabsContent>
// //         //         <TabsContent value="prévision">
// //         //             <Card>
// //         //                 <CardContent className="pt-6">
// //         //                     <EnhancedPrévisions />
// //         //                 </CardContent>
// //         //             </Card>
// //         //         </TabsContent>
// //         //     </Tabs>
// //         // </div>

// //         <Calendar
// //             mode="single"
// //             selected={date}
// //             onSelect={setDate}
// //             className="rounded-md border shadow"
// //         />
// //     );
// // }
// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { useToast } from "@/hooks/use-toast"
// import { AlertCircle, Check, Download, FileSpreadsheet, Save, Upload, X, Plus, Trash2 } from "lucide-react"

// // Define column types
// interface ColumnDefinition {
//   id: string
//   name: string
//   dataType: "string" | "number" | "date" | "email" | "boolean" | "select"
//   required: boolean
//   unique: boolean
//   validationRule?: string
//   options?: string[]
// }

// // Sample validation errors
// interface ValidationError {
//   row: number
//   column: string
//   value: string
//   message: string
// }

// export default function ExcelValidationPage() {
//   // State for column definitions
//   const [columns, setColumns] = useState<ColumnDefinition[]>([
//     {
//       id: "col1",
//       name: "Employee ID",
//       dataType: "string",
//       required: true,
//       unique: true,
//       validationRule: "^EMP\\d{4}$",
//     },
//     {
//       id: "col2",
//       name: "Full Name",
//       dataType: "string",
//       required: true,
//       unique: false,
//     },
//     {
//       id: "col3",
//       name: "Email",
//       dataType: "email",
//       required: true,
//       unique: true,
//     },
//     {
//       id: "col4",
//       name: "Department",
//       dataType: "select",
//       required: true,
//       unique: false,
//       options: ["HR", "Finance", "IT", "Marketing", "Operations", "Sales"],
//     },
//     {
//       id: "col5",
//       name: "Hire Date",
//       dataType: "date",
//       required: true,
//       unique: false,
//     },
//   ])

//   // State for new column
//   const [newColumn, setNewColumn] = useState<{
//     name: string
//     dataType: ColumnDefinition["dataType"]
//     required: boolean
//     unique: boolean
//     options: string
//   }>({
//     name: "",
//     dataType: "string",
//     required: false,
//     unique: false,
//     options: "",
//   })

//   // State for file upload
//   const [file, setFile] = useState<File | null>(null)
//   const [isValidating, setIsValidating] = useState(false)
//   const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
//   const [headerRow, setHeaderRow] = useState(1)
//   const [startRow, setStartRow] = useState(2)

//   const { toast } = useToast()

//   // Load saved configuration from localStorage on component mount
//   useEffect(() => {
//     const savedConfig = localStorage.getItem("excelValidationConfig")
//     if (savedConfig) {
//       try {
//         const config = JSON.parse(savedConfig)
//         if (config.columns) setColumns(config.columns)
//         if (config.headerRow) setHeaderRow(config.headerRow)
//         if (config.startRow) setStartRow(config.startRow)
//       } catch (error) {
//         console.error("Error loading saved configuration:", error)
//       }
//     }
//   }, [])

//   // Save configuration to localStorage
//   const saveConfiguration = () => {
//     const config = {
//       columns,
//       headerRow,
//       startRow,
//     }
//     localStorage.setItem("excelValidationConfig", JSON.stringify(config))
//     toast({
//       title: "Configuration saved",
//       description: "Your Excel validation configuration has been saved.",
//     })
//   }

//   // Handle adding a new column
//   const handleAddColumn = () => {
//     if (!newColumn.name.trim()) {
//       toast({
//         title: "Column name required",
//         description: "Please enter a name for the column.",
//         variant: "destructive",
//       })
//       return
//     }

//     const newColumnDef: ColumnDefinition = {
//       id: `col${Date.now()}`,
//       name: newColumn.name,
//       dataType: newColumn.dataType,
//       required: newColumn.required,
//       unique: newColumn.unique,
//     }

//     if (newColumn.dataType === "select" && newColumn.options.trim()) {
//       newColumnDef.options = newColumn.options.split(",").map((opt) => opt.trim())
//     }

//     setColumns([...columns, newColumnDef])
//     setNewColumn({
//       name: "",
//       dataType: "string",
//       required: false,
//       unique: false,
//       options: "",
//     })

//     toast({
//       title: "Column added",
//       description: `"${newColumn.name}" has been added to the configuration.`,
//     })
//   }

//   // Handle removing a column
//   const handleRemoveColumn = (columnId: string) => {
//     setColumns(columns.filter((col) => col.id !== columnId))
//     toast({
//       title: "Column removed",
//       description: "The column has been removed from the configuration.",
//       variant: "destructive",
//     })
//   }

//   // Handle file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFile(e.target.files[0])
//       setValidationErrors([])
//     }
//   }

//   // Simulate validating an Excel file
//   const validateExcelFile = () => {
//     if (!file) {
//       toast({
//         title: "No file selected",
//         description: "Please select an Excel file to validate.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsValidating(true)
//     setValidationErrors([])

//     // Simulate validation process
//     setTimeout(() => {
//       // For demonstration, generate some sample errors
//       // In a real implementation, you would parse the Excel file and validate against your rules
//       const sampleErrors: ValidationError[] = [
//         {
//           row: 3,
//           column: "Employee ID",
//           value: "E12345",
//           message: "Invalid format. Expected format: EMP followed by 4 digits.",
//         },
//         {
//           row: 5,
//           column: "Email",
//           value: "john.doe@",
//           message: "Invalid email address format.",
//         },
//         {
//           row: 7,
//           column: "Department",
//           value: "Research",
//           message: "Invalid value. Must be one of: HR, Finance, IT, Marketing, Operations, Sales.",
//         },
//         {
//           row: 8,
//           column: "Hire Date",
//           value: "2023-13-01",
//           message: "Invalid date format. Month value cannot be greater than 12.",
//         },
//         {
//           row: 10,
//           column: "Full Name",
//           value: "",
//           message: "Required field cannot be empty.",
//         },
//       ]

//       // If the filename contains "valid", show no errors for demonstration
//       if (file.name.toLowerCase().includes("valid")) {
//         toast({
//           title: "Validation successful",
//           description: "No errors found in the Excel file.",
//         })
//       } else {
//         setValidationErrors(sampleErrors)
//         toast({
//           title: "Validation completed",
//           description: `Found ${sampleErrors.length} errors in the Excel file.`,
//           variant: "destructive",
//         })
//       }

//       setIsValidating(false)
//     }, 1500)
//   }

//   // Generate a sample Excel file based on the configuration
//   const generateSampleFile = () => {
//     // In a real implementation, this would generate an Excel file
//     // For now, we'll just show a toast
//     toast({
//       title: "Sample file generated",
//       description: "A sample Excel file has been downloaded based on your configuration.",
//     })
//   }

//   // Data type options
//   const dataTypeOptions = [
//     { value: "string", label: "Text" },
//     { value: "number", label: "Number" },
//     { value: "date", label: "Date" },
//     { value: "email", label: "Email" },
//     { value: "boolean", label: "Boolean" },
//     { value: "select", label: "Select/Dropdown" },
//   ]

//     return (
//         <div className="container mx-auto py-8 px-4">
//             <div className="flex flex-col gap-8">
//                 <div className="flex flex-col gap-2">
//                     <h1 className="text-3xl font-bold">Excel Validation Configuration</h1>
//                     <p className="text-muted-foreground">
//                         Define validation rules for your Excel imports to avoid errors and ensure data quality.
//                     </p>
//                 </div>

//                 <Tabs defaultValue="configuration">
//                     <TabsList>
//                         <TabsTrigger value="configuration">Configuration</TabsTrigger>
//                         <TabsTrigger value="validation">File Validation</TabsTrigger>
//                     </TabsList>
                    

//                     <TabsContent value="configuration" className="mt-6">
//                         <div className="grid gap-6">
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Import Settings</CardTitle>
//                                     <CardDescription>Configure basic settings for Excel imports</CardDescription>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="space-y-2">
//                                             <Label htmlFor="header-row">Header Row</Label>
//                                             <Input
//                                                 id="header-row"
//                                                 type="number"
//                                                 min="1"
//                                                 value={headerRow}
//                                                 onChange={(e) => setHeaderRow(Number(e.target.value) || 1)}
//                                             />
//                                             <p className="text-xs text-muted-foreground">The row number that contains column headers</p>
//                                         </div>
//                                         <div className="space-y-2">
//                                             <Label htmlFor="start-row">Start Row</Label>
//                                             <Input
//                                                 id="start-row"
//                                                 type="number"
//                                                 min="2"
//                                                 value={startRow}
//                                                 onChange={(e) => setStartRow(Number(e.target.value) || 2)}
//                                             />
//                                             <p className="text-xs text-muted-foreground">The row number where data begins</p>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card>
//                                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                                     <div>
//                                         <CardTitle>Column Definitions</CardTitle>
//                                         <CardDescription>Define the columns and validation rules for your Excel files</CardDescription>
//                                     </div>
//                                     <Button onClick={saveConfiguration}>
//                                         <Save className="h-4 w-4 mr-2" />
//                                         Save Configuration
//                                     </Button>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="rounded-md border">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead>Column Name</TableHead>
//                                                     <TableHead>Data Type</TableHead>
//                                                     <TableHead className="w-[100px] text-center">Required</TableHead>
//                                                     <TableHead className="w-[100px] text-center">Unique</TableHead>
//                                                     <TableHead className="w-[80px]">Actions</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {columns.map((column) => (
//                                                     <TableRow key={column.id}>
//                                                         <TableCell>
//                                                             <div className="font-medium">{column.name}</div>
//                                                             {column.validationRule && (
//                                                                 <div className="text-xs text-muted-foreground mt-1">
//                                                                     Validation: {column.validationRule}
//                                                                 </div>
//                                                             )}
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             <Badge variant="outline">
//                                                                 {dataTypeOptions.find((opt) => opt.value === column.dataType)?.label}
//                                                             </Badge>
//                                                             {column.dataType === "select" && column.options && (
//                                                                 <div className="text-xs text-muted-foreground mt-1">
//                                                                     Options: {column.options.join(", ")}
//                                                                 </div>
//                                                             )}
//                                                         </TableCell>
//                                                         <TableCell className="text-center">
//                                                             {column.required ? (
//                                                                 <Check className="h-4 w-4 mx-auto text-green-500" />
//                                                             ) : (
//                                                                 <X className="h-4 w-4 mx-auto text-muted-foreground" />
//                                                             )}
//                                                         </TableCell>
//                                                         <TableCell className="text-center">
//                                                             {column.unique ? (
//                                                                 <Check className="h-4 w-4 mx-auto text-green-500" />
//                                                             ) : (
//                                                                 <X className="h-4 w-4 mx-auto text-muted-foreground" />
//                                                             )}
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             <Button
//                                                                 variant="ghost"
//                                                                 size="icon"
//                                                                 onClick={() => handleRemoveColumn(column.id)}
//                                                                 className="text-destructive hover:text-destructive/90"
//                                                             >
//                                                                 <Trash2 className="h-4 w-4" />
//                                                             </Button>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}

//                                                 <TableRow>
//                                                     <TableCell>
//                                                         <Input
//                                                             placeholder="Column name"
//                                                             value={newColumn.name}
//                                                             onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
//                                                         />
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Select
//                                                             value={newColumn.dataType}
//                                                             onValueChange={(value) =>
//                                                                 setNewColumn({ ...newColumn, dataType: value as ColumnDefinition["dataType"] })
//                                                             }
//                                                         >
//                                                             <SelectTrigger>
//                                                                 <SelectValue placeholder="Select type" />
//                                                             </SelectTrigger>
//                                                             <SelectContent>
//                                                                 {dataTypeOptions.map((option) => (
//                                                                     <SelectItem key={option.value} value={option.value}>
//                                                                         {option.label}
//                                                                     </SelectItem>
//                                                                 ))}
//                                                             </SelectContent>
//                                                         </Select>
//                                                         {newColumn.dataType === "select" && (
//                                                             <Input
//                                                                 className="mt-2"
//                                                                 placeholder="Options (comma separated)"
//                                                                 value={newColumn.options}
//                                                                 onChange={(e) => setNewColumn({ ...newColumn, options: e.target.value })}
//                                                             />
//                                                         )}
//                                                     </TableCell>
//                                                     <TableCell className="text-center">
//                                                         <Switch
//                                                             checked={newColumn.required}
//                                                             onCheckedChange={(checked) => setNewColumn({ ...newColumn, required: checked })}
//                                                         />
//                                                     </TableCell>
//                                                     <TableCell className="text-center">
//                                                         <Switch
//                                                             checked={newColumn.unique}
//                                                             onCheckedChange={(checked) => setNewColumn({ ...newColumn, unique: checked })}
//                                                         />
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Button variant="outline" size="sm" onClick={handleAddColumn}>
//                                                             <Plus className="h-4 w-4 mr-2" />
//                                                             Add
//                                                         </Button>
//                                                     </TableCell>
//                                                 </TableRow>

//                                                 {columns.length === 0 && (
//                                                     <TableRow>
//                                                         <TableCell colSpan={5} className="h-24 text-center">
//                                                             <div className="flex flex-col items-center justify-center">
//                                                                 <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
//                                                                 <p className="text-muted-foreground">No columns defined yet</p>
//                                                             </div>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 )}
//                                             </TableBody>
//                                         </Table>
//                                     </div>
//                                 </CardContent>
//                                 <CardFooter className="flex justify-between">
//                                     <Button variant="outline" onClick={generateSampleFile}>
//                                         <Download className="h-4 w-4 mr-2" />
//                                         Generate Sample File
//                                     </Button>
//                                     <Button onClick={saveConfiguration}>
//                                         <Save className="h-4 w-4 mr-2" />
//                                         Save Configuration
//                                     </Button>
//                                 </CardFooter>
//                             </Card>
//                         </div>
//                     </TabsContent>

//                     <TabsContent value="validation" className="mt-6">
//                         <div className="grid gap-6">
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Validate Excel File</CardTitle>
//                                     <CardDescription>Upload an Excel file to validate against your configuration</CardDescription>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="grid gap-6">
//                                         <div className="border-2 border-dashed rounded-lg p-8 text-center">
//                                             <input
//                                                 type="file"
//                                                 id="file-upload"
//                                                 className="hidden"
//                                                 accept=".xls,.xlsx"
//                                                 onChange={handleFileChange}
//                                             />

//                                             {file ? (
//                                                 <div className="flex flex-col items-center">
//                                                     <FileSpreadsheet className="h-12 w-12 text-primary mb-4" />
//                                                     <h3 className="text-lg font-medium mb-1">{file.name}</h3>
//                                                     <p className="text-sm text-muted-foreground mb-4">
//                                                         {(file.size / 1024 / 1024).toFixed(2)} MB
//                                                     </p>
//                                                     <div className="flex gap-2">
//                                                         <Button variant="outline" onClick={() => setFile(null)}>
//                                                             Remove File
//                                                         </Button>
//                                                         <Button onClick={validateExcelFile} disabled={isValidating}>
//                                                             {isValidating ? "Validating..." : "Validate File"}
//                                                         </Button>
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
//                                                     <Upload className="h-12 w-12 text-muted-foreground mb-4" />
//                                                     <h3 className="text-lg font-medium mb-1">Upload Excel File</h3>
//                                                     <p className="text-sm text-muted-foreground mb-4">
//                                                         Drag and drop your file here or click to browse
//                                                     </p>
//                                                     <Button variant="outline">Select File</Button>
//                                                 </label>
//                                             )}
//                                         </div>

//                                         {validationErrors.length > 0 && (
//                                             <Alert variant="destructive">
//                                                 <AlertCircle className="h-4 w-4" />
//                                                 <AlertTitle>Validation Errors</AlertTitle>
//                                                 <AlertDescription>Found {validationErrors.length} errors in your Excel file.</AlertDescription>
//                                             </Alert>
//                                         )}

//                                         {validationErrors.length > 0 && (
//                                             <div className="rounded-md border">
//                                                 <Table>
//                                                     <TableHeader>
//                                                         <TableRow>
//                                                             <TableHead className="w-[80px]">Row</TableHead>
//                                                             <TableHead>Column</TableHead>
//                                                             <TableHead>Value</TableHead>
//                                                             <TableHead>Error</TableHead>
//                                                         </TableRow>
//                                                     </TableHeader>
//                                                     <TableBody>
//                                                         {validationErrors.map((error, index) => (
//                                                             <TableRow key={index}>
//                                                                 <TableCell className="font-mono">{error.row}</TableCell>
//                                                                 <TableCell>{error.column}</TableCell>
//                                                                 <TableCell className="font-mono">
//                                                                     {error.value || <span className="text-muted-foreground italic">(empty)</span>}
//                                                                 </TableCell>
//                                                                 <TableCell>{error.message}</TableCell>
//                                                             </TableRow>
//                                                         ))}
//                                                     </TableBody>
//                                                 </Table>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Validation Rules</CardTitle>
//                                     <CardDescription>Summary of the validation rules that will be applied</CardDescription>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="space-y-4">
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div className="p-4 border rounded-lg">
//                                                 <h3 className="font-medium mb-2">Basic Rules</h3>
//                                                 <ul className="list-disc pl-5 text-sm space-y-1">
//                                                     <li>Headers must be in row {headerRow}</li>
//                                                     <li>Data must start from row {startRow}</li>
//                                                     <li>All required columns must be present</li>
//                                                     <li>All data must match the specified data types</li>
//                                                 </ul>
//                                             </div>

//                                             <div className="p-4 border rounded-lg">
//                                                 <h3 className="font-medium mb-2">Required Columns</h3>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {columns
//                                                         .filter((col) => col.required)
//                                                         .map((col) => (
//                                                             <Badge key={col.id} variant="outline">
//                                                                 {col.name}
//                                                             </Badge>
//                                                         ))}
//                                                     {columns.filter((col) => col.required).length === 0 && (
//                                                         <span className="text-sm text-muted-foreground">No required columns defined</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="p-4 border rounded-lg">
//                                             <h3 className="font-medium mb-2">Data Type Validation</h3>
//                                             <ul className="list-disc pl-5 text-sm space-y-1">
//                                                 <li>
//                                                     <span className="font-medium">Text:</span> Any text value is accepted
//                                                 </li>
//                                                 <li>
//                                                     <span className="font-medium">Number:</span> Must be a valid number
//                                                 </li>
//                                                 <li>
//                                                     <span className="font-medium">Date:</span> Must be a valid date (YYYY-MM-DD format
//                                                     recommended)
//                                                 </li>
//                                                 <li>
//                                                     <span className="font-medium">Email:</span> Must be a valid email address
//                                                 </li>
//                                                 <li>
//                                                     <span className="font-medium">Boolean:</span> Must be true/false, yes/no, 0/1
//                                                 </li>
//                                                 <li>
//                                                     <span className="font-medium">Select:</span> Must match one of the predefined options
//                                                 </li>
//                                             </ul>
//                                         </div>

//                                         <div className="p-4 border rounded-lg">
//                                             <h3 className="font-medium mb-2">Common Errors</h3>
//                                             <ul className="list-disc pl-5 text-sm space-y-1">
//                                                 <li>Missing required columns in the header row</li>
//                                                 <li>Empty cells for required fields</li>
//                                                 <li>Invalid data types (e.g., text in a number field)</li>
//                                                 <li>Invalid date formats</li>
//                                                 <li>Duplicate values in columns marked as unique</li>
//                                                 <li>Values not matching the predefined options for select fields</li>
//                                             </ul>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     </TabsContent>
//                 </Tabs>
//             </div>
//         </div>
//     );
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp, Download, FileWarning, Filter, RefreshCw, Upload, X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

// Define error types
type ErrorSeverity = "critical" | "warning" | "info"

interface ImportError {
  id: string
  line: number
  column: string
  value: string
  errorType: string
  message: string
  severity: ErrorSeverity
  suggestion?: string
}

interface ImportSummary {
  fileName: string
  totalRows: number
  processedRows: number
  errorCount: number
  warningCount: number
  importDate: string
  errorsByType: Record<string, number>
}

// Sample data
const sampleImportSummary: ImportSummary = {
  fileName: "employee_data_2023.xlsx",
  totalRows: 1250,
  processedRows: 1230,
  errorCount: 15,
  warningCount: 5,
  importDate: "2023-04-24T14:30:00Z",
  errorsByType: {
    "Invalid Date": 5,
    "Missing Required Field": 4,
    "Invalid Email": 3,
    "Duplicate Entry": 2,
    "Invalid Number": 1,
  },
}

const sampleErrors: ImportError[] = [
  {
    id: "err1",
    line: 23,
    column: "Date of Birth",
    value: "31/02/1990",
    errorType: "Invalid Date",
    message: "The date '31/02/1990' is not valid. February cannot have 31 days.",
    severity: "critical",
    suggestion: "Check the day value and ensure it's valid for the given month.",
  },
  {
    id: "err2",
    line: 45,
    column: "Email",
    value: "john.doe@",
    errorType: "Invalid Email",
    message: "The email address 'john.doe@' is incomplete.",
    severity: "critical",
    suggestion: "Add the domain part to the email address (e.g., john.doe@example.com).",
  },
  {
    id: "err3",
    line: 67,
    column: "Employee ID",
    value: "",
    errorType: "Missing Required Field",
    message: "Employee ID is a required field but was left empty.",
    severity: "critical",
    suggestion: "Add a unique employee ID for this record.",
  },
  {
    id: "err4",
    line: 89,
    column: "Phone Number",
    value: "123-abc-4567",
    errorType: "Invalid Number",
    message: "The phone number '123-abc-4567' contains non-numeric characters.",
    severity: "warning",
    suggestion: "Remove letters and use only numbers and hyphens.",
  },
  {
    id: "err5",
    line: 112,
    column: "Employee ID",
    value: "EMP001",
    errorType: "Duplicate Entry",
    message: "The Employee ID 'EMP001' already exists in the system.",
    severity: "critical",
    suggestion: "Use a different, unique employee ID.",
  },
  {
    id: "err6",
    line: 134,
    column: "Department",
    value: "Slaes",
    errorType: "Possible Typo",
    message: "The department 'Slaes' is not recognized. Did you mean 'Sales'?",
    severity: "warning",
    suggestion: "Check spelling and correct to a valid department name.",
  },
  {
    id: "err7",
    line: 156,
    column: "Salary",
    value: "5O,000",
    errorType: "Invalid Number",
    message: "The salary '5O,000' contains a letter 'O' instead of zero '0'.",
    severity: "warning",
    suggestion: "Replace 'O' with '0' to make it a valid number.",
  },
  {
    id: "err8",
    line: 178,
    column: "Hire Date",
    value: "2023-13-01",
    errorType: "Invalid Date",
    message: "The date '2023-13-01' is invalid. Month value cannot be greater than 12.",
    severity: "critical",
    suggestion: "Check the month value and ensure it's between 1 and 12.",
  },
  {
    id: "err9",
    line: 201,
    column: "Manager",
    value: "",
    errorType: "Missing Required Field",
    message: "Manager is a required field but was left empty.",
    severity: "critical",
    suggestion: "Assign a manager to this employee.",
  },
  {
    id: "err10",
    line: 223,
    column: "Email",
    value: "jane.smith@company.com",
    errorType: "Duplicate Entry",
    message: "The email 'jane.smith@company.com' is already assigned to another employee.",
    severity: "critical",
    suggestion: "Use a different email address for this employee.",
  },
]

export default function ImportErrorsPage() {
  const [errors, setErrors] = useState<ImportError[]>(sampleErrors)
  const [summary, setSummary] = useState<ImportSummary>(sampleImportSummary)
  const [sortColumn, setSortColumn] = useState<keyof ImportError>("line")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterSeverity, setFilterSeverity] = useState<ErrorSeverity | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const errorsPerPage = 5

  // Filter and sort errors
  const filteredErrors = errors
    .filter((error) => filterSeverity === "all" || error.severity === filterSeverity)
    .filter(
      (error) =>
        error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.column.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.errorType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.line.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredErrors.length / errorsPerPage)
  const indexOfLastError = currentPage * errorsPerPage
  const indexOfFirstError = indexOfLastError - errorsPerPage
  const currentErrors = filteredErrors.slice(indexOfFirstError, indexOfLastError)

  // Handle sort
  const handleSort = (column: keyof ImportError) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Generate CSV of errors
  const downloadErrorsCSV = () => {
    const headers = ["Line", "Column", "Value", "Error Type", "Message", "Severity", "Suggestion"]
    const csvContent = [
      headers.join(","),
      ...filteredErrors.map((error) =>
        [
          error.line,
          `"${error.column}"`,
          `"${error.value}"`,
          `"${error.errorType}"`,
          `"${error.message}"`,
          error.severity,
          `"${error.suggestion || ""}"`,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `import_errors_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate success rate
  const successRate = Math.round(((summary.totalRows - summary.errorCount) / summary.totalRows) * 100)

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Import Errors</h1>
                    <p className="text-muted-foreground">
                        Review and resolve errors found during the import of your Excel file.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">File</CardTitle>
                            <CardDescription>{summary.fileName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.totalRows}</div>
                            <p className="text-muted-foreground text-sm">Total rows</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Success Rate</CardTitle>
                            <CardDescription>
                                {summary.processedRows} of {summary.totalRows} rows processed
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">{successRate}%</span>
                                    <Badge variant={successRate > 90 ? "default" : "destructive"}>
                                        {successRate > 90 ? "Good" : "Needs Attention"}
                                    </Badge>
                                </div>
                                <Progress value={successRate} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Critical Errors</CardTitle>
                            <CardDescription>Require attention before import</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                                <div className="text-2xl font-bold">{summary.errorCount}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Warnings</CardTitle>
                            <CardDescription>May need review</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                                <div className="text-2xl font-bold">{summary.warningCount}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="errors" className="w-full">
                    <TabsList>
                        <TabsTrigger value="errors" className="flex items-center gap-2">
                            <FileWarning className="h-4 w-4" />
                            Error Details
                        </TabsTrigger>
                        <TabsTrigger value="summary" className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Error Summary
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="errors" className="mt-6">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <CardTitle>Error Details</CardTitle>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="relative">
                                            <Input
                                                placeholder="Search errors..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full sm:w-[250px]"
                                            />
                                            {searchTerm && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full"
                                                    onClick={() => setSearchTerm("")}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                    <Filter className="h-4 w-4" />
                                                    <span>Filter</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setFilterSeverity("all")}>
                                                    All Errors
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setFilterSeverity("critical")}>
                                                    Critical Only
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setFilterSeverity("warning")}>
                                                    Warnings Only
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setFilterSeverity("info")}>
                                                    Info Only
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Button variant="outline" size="sm" onClick={downloadErrorsCSV}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableCaption>
                                            {filterSeverity !== "all"
                                                ? `Showing ${filterSeverity} errors only`
                                                : "Showing all import errors"}
                                        </TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead
                                                    className="w-[80px] cursor-pointer"
                                                    onClick={() => handleSort("line")}
                                                >
                                                    <div className="flex items-center">
                                                        Line
                                                        {sortColumn === "line" && (
                                                            <span className="ml-1">
                                                                {sortDirection === "asc" ? (
                                                                    <ArrowUp className="h-3 w-3" />
                                                                ) : (
                                                                    <ArrowDown className="h-3 w-3" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableHead>
                                                <TableHead
                                                    className="cursor-pointer"
                                                    onClick={() => handleSort("column")}
                                                >
                                                    <div className="flex items-center">
                                                        Column
                                                        {sortColumn === "column" && (
                                                            <span className="ml-1">
                                                                {sortDirection === "asc" ? (
                                                                    <ArrowUp className="h-3 w-3" />
                                                                ) : (
                                                                    <ArrowDown className="h-3 w-3" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableHead>
                                                <TableHead>Value</TableHead>
                                                <TableHead
                                                    className="cursor-pointer"
                                                    onClick={() => handleSort("errorType")}
                                                >
                                                    <div className="flex items-center">
                                                        Error Type
                                                        {sortColumn === "errorType" && (
                                                            <span className="ml-1">
                                                                {sortDirection === "asc" ? (
                                                                    <ArrowUp className="h-3 w-3" />
                                                                ) : (
                                                                    <ArrowDown className="h-3 w-3" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableHead>
                                                <TableHead
                                                    className="cursor-pointer"
                                                    onClick={() => handleSort("severity")}
                                                >
                                                    <div className="flex items-center">
                                                        Severity
                                                        {sortColumn === "severity" && (
                                                            <span className="ml-1">
                                                                {sortDirection === "asc" ? (
                                                                    <ArrowUp className="h-3 w-3" />
                                                                ) : (
                                                                    <ArrowDown className="h-3 w-3" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">Message</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentErrors.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <FileWarning className="h-8 w-8 text-muted-foreground" />
                                                            <p className="text-muted-foreground">No errors found matching your criteria</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                currentErrors.map((error) => (
                                                    <TableRow key={error.id} className="group">
                                                        <TableCell className="font-mono">{error.line}</TableCell>
                                                        <TableCell>{error.column}</TableCell>
                                                        <TableCell className="font-mono max-w-[150px] truncate" title={error.value}>
                                                            {error.value || <span className="text-muted-foreground italic">(empty)</span>}
                                                        </TableCell>
                                                        <TableCell>{error.errorType}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    error.severity === "critical"
                                                                        ? "destructive"
                                                                        : error.severity === "warning"
                                                                            ? "outline"
                                                                            : "secondary"
                                                                }
                                                            >
                                                                {error.severity}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell max-w-[300px]">
                                                            <div className="space-y-1">
                                                                <p>{error.message}</p>
                                                                {error.suggestion && (
                                                                    <p className="text-xs text-muted-foreground">
                                                                        <span className="font-semibold">Suggestion:</span> {error.suggestion}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-4">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setCurrentPage(Math.max(1, currentPage - 1))
                                                        }}
                                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                                    />
                                                </PaginationItem>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setCurrentPage(page)
                                                            }}
                                                            isActive={currentPage === page}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setCurrentPage(Math.min(totalPages, currentPage + 1))
                                                        }}
                                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing {currentErrors.length} of {filteredErrors.length} errors
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Retry Import
                                    </Button>
                                    <Button size="sm">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Fixed File
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="summary" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Error Summary</CardTitle>
                                <CardDescription>Breakdown of errors by type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-medium mb-4">Error Types</h3>
                                            <div className="space-y-4">
                                                {Object.entries(summary.errorsByType).map(([type, count]) => (
                                                    <div key={type} className="flex items-center justify-between">
                                                        <span>{type}</span>
                                                        <div className="flex items-center">
                                                            <span className="font-medium mr-2">{count}</span>
                                                            <div className="w-[100px] bg-muted rounded-full h-2 overflow-hidden">
                                                                <div
                                                                    className="bg-primary h-full"
                                                                    style={{
                                                                        width: `${(count / (summary.errorCount + summary.warningCount)) * 100}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium mb-4">Common Solutions</h3>
                                            <div className="space-y-4">
                                                <div className="p-4 border rounded-lg">
                                                    <h4 className="font-medium mb-2">Invalid Dates</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Ensure dates are in the correct format (YYYY-MM-DD) and contain valid values.
                                                    </p>
                                                    <Badge variant="outline">5 occurrences</Badge>
                                                </div>
                                                <div className="p-4 border rounded-lg">
                                                    <h4 className="font-medium mb-2">Missing Required Fields</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Fill in all required fields before importing. Check the template for guidance.
                                                    </p>
                                                    <Badge variant="outline">4 occurrences</Badge>
                                                </div>
                                                <div className="p-4 border rounded-lg">
                                                    <h4 className="font-medium mb-2">Invalid Email Addresses</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Ensure all email addresses are in the correct format (user@domain.com).
                                                    </p>
                                                    <Badge variant="outline">3 occurrences</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Next Steps</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">Download Error Report</CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <p className="text-sm text-muted-foreground">
                                                        Download a detailed CSV report of all errors for offline review.
                                                    </p>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button variant="outline" size="sm" className="w-full" onClick={downloadErrorsCSV}>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download CSV
                                                    </Button>
                                                </CardFooter>
                                            </Card>

                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">Fix and Re-upload</CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <p className="text-sm text-muted-foreground">
                                                        Correct the errors in your Excel file and upload it again.
                                                    </p>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button size="sm" className="w-full">
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Upload Fixed File
                                                    </Button>
                                                </CardFooter>
                                            </Card>

                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">Partial Import</CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <p className="text-sm text-muted-foreground">
                                                        Import only the valid rows and skip the ones with errors.
                                                    </p>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                        Import Valid Rows
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

