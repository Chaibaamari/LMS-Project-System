"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Form, useNavigation,useNavigate, useParams, Link } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { fields, User } from "@/assets/modelData"
import { getAuthToken } from "@/util/Auth"

export function DynamicEditForm() {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const params = useParams();
    const isSubmitting = navigation.state === "submitting";

    const [editFormData, setEditFormData] = useState<User>({
        Matricule: params.matricule as string,
        prenomnom: "",
        Date_Naissance: "",
        Date_Recrutement: "",
        Sexe: "",
        CSP: "",
        Echelle: "",
        CodeFonction: "",
        Id_direction: "",
    });
    
    const handleInputChange = (name: keyof typeof editFormData, value: string) => {
        setEditFormData((prev) => ({ ...prev, [name]: value }))
    };
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch(
            `http://127.0.0.1:8000/api/employes/edit/${params.matricule}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editFormData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return console.log(errorData);
        }

        const data = await response.json();
        console.log('Update successful:', data.success);
        navigate('/homePage/Employee')
    };
    const token = getAuthToken();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/employes/edit/${params.matricule}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    },
                )
                    const data = await response.json();
                setEditFormData((prevData) => ({
                    ...prevData,
                    Matricule: data.data.Matricule || "",
                    prenomnom: data.data.prenomnom || "",
                    Date_Naissance: data.data.Date_Naissance || "",
                    Date_Recrutement: data.data.Date_Recrutement || "",
                    Sexe: data.data.Sexe || "",
                    CSP: data.data.CSP || "",
                    Echelle: data.data.Echelle || "",
                    CodeFonction: data.data.CodeFonction || "",
                    Id_direction: data.data.Id_direction || "",
                }));
            } catch (err) {
                console.log(err)
            }
        }
        fetchData();
    } , []);
    return (
        <div className="container mx-auto py-10 px-4 sm:px-6">
            <Card className="transition-all duration-200">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-2xl font-bold text-center sm:text-left">Employee Information Update</CardTitle>
                    <CardDescription className="text-muted-foreground">Update employee details in the form below</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form method="post" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6">
                            {/* Group fields into sections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                {fields.map((field) => (
                                    <div key={field.name} className="space-y-2 group">
                                        <Label htmlFor={field.name} className="font-medium group-hover:text-primary transition-colors">
                                            {field.label}
                                        </Label>
                                        {field.type === "input" && (
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={editFormData[field.name]}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                placeholder={field.placeholder}
                                            />
                                        )}
                                        {field.type === "select" && (
                                            <Select
                                                value={editFormData[field.name] as string}
                                                onValueChange={(value) => handleInputChange(field.name, value)}
                                            >
                                                <SelectTrigger
                                                    id={field.name}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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
                                        )}
                                        {field.type === "date" && (
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="date"
                                                value={editFormData[field.name] as string}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        )}
                                        {field.type === "number" && (
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="number"
                                                value={editFormData[field.name as keyof User] as string}
                                                onChange={(e) => handleInputChange(field.name as keyof User, e.target.value)}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                            <Link to={`/homePage/Employee`}>
                            <Button variant="outline" type="button" className="transition-all duration-200 hover:bg-muted">
                                Cancel
                            </Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save changes"}
                            </Button>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

