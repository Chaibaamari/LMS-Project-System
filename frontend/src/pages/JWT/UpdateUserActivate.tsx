import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuthToken } from "@/util/Auth";
import { Loader2, UserPlus, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function UpdateUserActivate() {
    const navigate = useNavigate();
    const params = useParams();
    const { toast } = useToast();
    // const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const token = getAuthToken();

    const formSchema = z.object({
        name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
        email: z.string().email({ message: "Veuillez saisir une adresse email valide" }),
        role: z.enum(["consultant", "gestionnaire", "responsable"], {
            required_error: "Veuillez sélectionner un rôle utilisateur",
        }),
        active: z.union([z.literal(1), z.literal(0)]),
        
    });

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "consultant",
            active: 0,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/user/edit/${params.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || "Failed to fetch user data");
                }

                const data = await response.json();
                form.reset({
                    name: data.Employe.name,
                    email: data.Employe.email,
                    role: data.Employe.role,
                    active:data.Employe.active,
                });
                // setIsLoading(false);
            } catch (err) {
                toast({
                    title: "Failed to load user",
                    description: err instanceof Error ? err.message : "An unknown error occurred",
                    variant: "destructive",
                });
                // navigate('/homePage/Employee');
            }
        };
        fetchData();
    }, [params.id, token, form, toast, navigate]);

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/user/pass/${params.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...data,
                        active:Number(data.active),
                    }),
                }
            );

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to update user");
            }

            setIsSuccess(true);
            toast({
                title: "User updated successfully",
                description: "User information has been updated",
            });
            console.log(data);
            return navigate('/homePage/Settings');
        } catch (err) {
            toast({
                title: "Failed to update user",
                description: err instanceof Error ? err.message : "An unknown error occurred",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // if (isLoading) {
    //     return (
    //         <div className="flex justify-center items-center h-64">
    //             <Loader2 className="h-8 w-8 animate-spin" />
    //         </div>
    //     );
    // }

    return (
        <div className="space-y-4 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-5">
                <Link to="/homePage/Settings">
                    <Button variant="outline" className="font-raleway border-2 border-primary text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour aux paramètres
                    </Button>
                </Link>
        </div>
        <Card className="w-3/5 items-center mx-auto">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    Modification d'utilisateur
                </CardTitle>
                <CardDescription>Modify d'information utilisateur</CardDescription>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Le Nom Complete</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="responsable">Responsible</SelectItem>
                                            <SelectItem value="gestionnaire">gestionnaire</SelectItem>
                                            <SelectItem value="consultant">Consultant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>difini permission</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Active\Déactive</FormLabel>
                                    <Select
                                        value={field.value?.toString()} // S'assurer que c’est une string
                                        onValueChange={(value) => field.onChange(Number(value))} // Convertir en number ici
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Activé</SelectItem>
                                            <SelectItem value="0">Desactivé</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Donner accés d'entrer</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isSuccess && (
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                                <CheckCircle className="h-4 w-4" />
                                <span>User updated successfully!</span>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update User"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
        </div>
    );
}