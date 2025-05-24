"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, useActionData, useSearchParams, useNavigation } from "react-router-dom"
import type { ActionData } from "@/assets/modelData"
import { Eye, EyeOff, Lock, Mail,  AlertCircle} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get("mode") !== "register";
    const data = useActionData<ActionData>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className={cn("flex flex-col gap-6 w-[400px]  mx-auto", className)} {...props}>
            <Card className="w-full shadow-lg border-2">
                <CardHeader className="space-y-4 text-center pb-6">
                    <div className="mx-auto w-20 h-20 mb-2">
                        <img
                            src="/Sonatrach.svg"
                            alt="Sonatrach Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold">Bienvenue sur notre plateforme de gestion de la formation</CardTitle>
                    <CardDescription className="text-base">Connectez-vous avec votre compte Sonatrach.</CardDescription>

                    {data?.error?.msg && !Array.isArray(data.error.msg) && (
                        <div className="mt-4 flex items-center justify-between p-3 bg-red-100 border border-red-400 rounded-md">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <AlertDescription className="text-red-600 font-bold">{data.error.msg}</AlertDescription>
                            <div></div>
                        </div>
                    )}

                    {Array.isArray(data?.error?.msg) && data.error.msg.length > 0 && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <ul className="list-disc pl-5">
                                    {data.error.msg.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardHeader>

                <CardContent className="px-6">
                    <Form method="post">
                        <div className="grid gap-6">

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        {isLogin ? "Ou continuez avec" : "Ou créez un compte"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {/* {!isLogin && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Nom & Prénom
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="name" name="name" placeholder="John Doe" className="pl-10" required />
                                        </div>
                                    </div>
                                )} */}

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="m@Sonatrach.dz"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            Mot de passe
                                        </Label>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="**********"
                                            className="pl-10 pr-10"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1 h-8 w-8"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* {!isLogin && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                            Confirmation mot de passe
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="password_confirmation"
                                                className="pl-10 pr-10"
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1 h-8 w-8"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                                            </Button>
                                        </div>
                                    </div>
                                )} */}

                                <Button type="submit" className="w-full py-6 text-base font-medium mt-2" disabled={isSubmitting}>
                                    {isSubmitting ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </CardContent>

                {/* <CardFooter className="px-6 py-4 flex flex-col gap-4">
                    <div className="text-center text-sm">
                        {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}{" "}
                        <Link
                            to={`?mode=${isLogin ? "register" : "login"}`}
                            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                        >
                            {isLogin ? "S'inscrire" : "Se connecter"}
                        </Link>
                    </div>
                </CardFooter> */}
            </Card>
        </div>
    );
}

export default LoginForm

