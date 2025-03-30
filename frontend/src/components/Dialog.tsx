import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form, useNavigation } from "react-router-dom";


interface FieldConfig {
    type: "input" | "select" | "date" | "number";
    name: string;
    label: string;
    placeholder?: string;
    options?: { value: string; label: string }[]; // For select fields
}

interface DynamicEditDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    fields: FieldConfig[];
    formData: Record<string, any>; // Corrected type definition
    onChange: (name: string, value: string) => void;
    onSave: () => void;
    methode: string;
    onCancel: () => void;
}

export function DynamicEditDialog({
    isOpen,
    onOpenChange,
    title,
    description,
    fields,
    formData,
    onChange,
    onSave,
    onCancel,
}: DynamicEditDialogProps) {
    const navigation = useNavigation();
    // const navigate = useNavigate();
    const isSubmitting = navigation.state === "submitting";
    // const [errors, setErrors] = useState<Record<string, string[]>>({});
    // const [success, setSuccess] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
     // Reset form states when dialog opens/closes
    // useEffect(() => {
    //     if (!isOpen) {
    //         setErrors({});
    //         setSuccess(false);
    //         setIsLoading(false);
    //     }
    // }, [isOpen]);

    // Auto-hide success message after 3 seconds
    // useEffect(() => {
    //     if (success) {
    //         const timer = setTimeout(() => {
    //             setSuccess(false);
    //             onOpenChange(false); // Optionally close the dialog on success
    //         }, 3000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [success, onOpenChange]);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Create the data object directly from formData prop which is already controlled
        // const dataAuth = {
        //     Matricule: formData.Matricule,
        //     Nom: formData.Nom,
        //     Prénom: formData.Prénom,
        //     Date_Naissance: formData.Date_Naissance,
        //     Date_Recrutement : formData.Date_Recrutement,
        //     Sexe: formData.Sexe,  // Make sure this is being set in your form
        //     CSP: formData.CSP,    // Make sure this is being set in your form
        //     Fonction: formData.Fonction,
        //     Echelle: formData.Echelle,
        //     CodeFonction: Number(formData.CodeFonction),
        //     Id_direction: "DIR001",
        // };
        
        // console.log("Submitting:", dataAuth);
         onSave(); // Call the parent's save handler

        // setIsLoading(true);
        // setErrors({});
        // setSuccess(false);
        // const token = getAuthToken();
        // if (methode == "POST") {
        //     try {
        //     const response = await fetch("http://127.0.0.1:8000/api/employes/new", {
        //         method: "POST",
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Accept': 'application/json',
        //             "Authorization": `Bearer ${token}`
        //         },
        //         body: JSON.stringify(dataAuth),
        //     });
        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         if (errorData.errors) {
        //             setErrors(errorData.errors);
        //         } else {
        //             setErrors({ general: [errorData.message || 'Unknown error occurred'] });
        //         }
        //         return;
        //     }
        
        //     const data = await response.json();
        //     console.log('Success:', data);
        //     setSuccess(true);
        //     navigate('/homePage'); // Redirect after success
        // } catch (error) {
        //     console.error('API Request Failed:', error);
        //     setErrors({ general: ['Network error or server unavailable'] });
        // } finally {
        //     setIsLoading(false);
        // }
        // } else {
        //     console.log("not post reqeust")
        //}
    };
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[93vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {/* <div className="p-4 max-w-md mx-auto">
                <h2 className="text-lg font-bold mb-4">Employee Creation Test</h2>
                {isLoading && (
                    <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4">
                        Sending request to server...
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
                        Employee created successfully!
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
                        <h3 className="font-bold mb-2">Validation Errors:</h3>
                        <ul className="list-disc pl-5">
                            {Object.entries(errors).map(([field, messages]) => (
                                messages.map((message, index) => (
                                    <li key={`${field}-${index}`}>
                                        <strong>{field}:</strong> {message}
                                    </li>
                                ))
                            ))}
                        </ul>
                    </div>
                    )}
                </div> */}
                <Form method="post" onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map((field) => (
                                <div key={field.name}>
                                    <Label htmlFor={field.name}>{field.label}</Label>
                                    {field.type === "input" && (
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={formData[field.name] || ""}
                                            onChange={(e) => onChange(field.name, e.target.value)}
                                            className="mt-1"
                                            placeholder={field.placeholder}
                                        />
                                    )}
                                    {field.type === "select" && (
                                        <Select
                                            value={formData[field.name]}
                                            onValueChange={(value) => onChange(field.name, value)}
                                        >
                                            <SelectTrigger id={field.name} className="mt-1">
                                                <SelectValue placeholder={field.placeholder} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options?.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    {field.type === "date" && (
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="date"
                                            value={formData[field.name] || ""}
                                            onChange={(e) => onChange(field.name, e.target.value)}
                                            className="mt-1"
                                        />
                                    )}
                                    {field.type === "number" && (
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="number"
                                            value={formData[field.name] || 0}
                                            onChange={(e) => onChange(field.name, e.target.value)}
                                            className="mt-1"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

