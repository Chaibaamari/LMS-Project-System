"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UserPlus, CheckCircle, EyeOff, Eye } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { getAuthToken } from "@/util/Auth"
import { AppDispatch, RootState } from "@/store/indexD"
import { useDispatch, useSelector } from "react-redux"
import { SettingActions } from "@/store/setting"
import { useNavigate } from "react-router-dom"

// Schéma du formulaire avec Zod
const formSchema = z.object({
    name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Veuillez saisir une adresse email valide" }),
    password: z
        .string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
        .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule" })
        .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule" })
        .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
    role: z.enum(["consultant", "gestionnaire", "responsable"], {
        required_error: "Veuillez sélectionner un rôle utilisateur",
    }),
});

type FormValues = z.infer<typeof formSchema>


export default function GestionUtilisateurs() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [isSuccess, setIsSuccess] = useState(false);
    const { IsVisible} = useSelector((state: RootState) => state.Setting.Notification);

    const [showPassword, setShowPassword] = useState(false);
    const token = getAuthToken();
    const dispatch = useDispatch<AppDispatch>();
    const navigator = useNavigate();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "gestionnaire",
        },
    });

    async function creerUtilisateur(data: FormValues) {
        try {
            
            dispatch(SettingActions.ShowNotification({
                IsVisible: true,
                status: 'pending',
                message: "Processus de création d'utilisateur en cours d'exécution..."
            }));
            const response = await fetch("http://127.0.0.1:8000/api/createUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),
            })
            const errorData = await response.json();
            if (!response.ok) {
                dispatch(SettingActions.ShowNotification({
                    IsVisible: true,
                    status:'failed',
                    message: errorData.message || "Erreur lors de la création de l'utilisateur"
                }));
                return navigator('/homePage/Setting');
            }
            dispatch(SettingActions.ShowNotification({
                IsVisible: true,
                status:'success',
                message: "Utilisateur créé avec succès"
            }));
            
        } catch (error) { 
            dispatch(SettingActions.ShowNotification({
                IsVisible: true,
                status:'failed',
                message: error instanceof Error ? error.message : "Une erreur inconnue est survenue"
            }));
            return navigator('/homePage/Setting');
        }
    }

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true)

    await creerUtilisateur(data)
        dispatch(SettingActions.ShowNotification({
            IsVisible: true,
            status:'success',
            message: `${data.name} a été ajouté en tant que ${data.role}`
        }));

      form.reset()
    } catch (error) {
        dispatch(SettingActions.ShowNotification({
            IsVisible: true,
            status:'failed',
            message: error instanceof Error ? error.message : "Une erreur inconnue est survenue"
        }));
    } finally {
      setIsSubmitting(false)
      };
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    Gestion des utilisateurs
                </CardTitle>
                <CardDescription>Ajoutez de nouveaux utilisateurs à votre organisation</CardDescription>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom complet</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jean Dupont" {...field} />
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
                                        <Input type="email" placeholder="jean.dupont@exemple.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <div className="relative"> {/* 👈 Add this wrapper */}
                                            <Input
                                                type={showPassword ? "text" : "password"} // 👈 Toggle type
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" // 👈 Center vertically
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                                <span className="sr-only">
                                                    {showPassword ? "Hide password" : "Show password"}
                                                </span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rôle utilisateur</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un rôle" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="responsable">Responsable</SelectItem>
                                            <SelectItem value="gestionnaire">Gestionnaire</SelectItem>
                                            <SelectItem value="consultant">Consultant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Définit les permissions de l'utilisateur</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {IsVisible && (
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                                <CheckCircle className="h-4 w-4" />
                                <span>Utilisateur créé avec succès !</span>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création en cours...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Ajouter un utilisateur
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
