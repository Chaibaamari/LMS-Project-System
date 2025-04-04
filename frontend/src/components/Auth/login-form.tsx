"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, Link, useActionData, useSearchParams, useNavigation } from "react-router-dom"
import type { ActionData } from "@/assets/modelData"
import { Eye, EyeOff, Lock, Mail, User, AlertCircle} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [searchParams] = useSearchParams()
  const isLogin = searchParams.get("mode") !== "register"
  const data = useActionData<ActionData>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate password reset email being sent
    setResetEmailSent(true)
    // In a real app, you would call your API here
  }

    return (
        <div className={cn("flex flex-col gap-6 w-max max-w-md mx-auto", className)} {...props}>
            <Card className="w-full shadow-lg border-2">
                <CardHeader className="space-y-4 text-center pb-6">
                    <div className="mx-auto w-20 h-20 mb-2">
                        <img
                            src="/Sonatrach.svg"
                            alt="Sonatrach Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold">Bienvenue de retour !</CardTitle>
                    <CardDescription className="text-base">Connectez-vous avec votre compte Sonatrach.</CardDescription>

                    {data?.error?.msg && !Array.isArray(data.error.msg) && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{data.error.msg}</AlertDescription>
                        </Alert>
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
                                {!isLogin && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Nom & Prénom
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="name" name="name" placeholder="John Doe" className="pl-10" required />
                                        </div>
                                    </div>
                                )}

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
                                            placeholder="m@example.com"
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
                                        {isLogin && (
                                            <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="link" className="px-0 text-sm h-auto">
                                                        Mot de passe oublié ?
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Réinitialiser votre mot de passe</DialogTitle>
                                                        <DialogDescription>
                                                            Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de
                                                            passe.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    {resetEmailSent ? (
                                                        <div className="space-y-4 py-4">
                                                            <Alert>
                                                                <AlertDescription>
                                                                    Si un compte existe avec cette adresse e-mail, vous recevrez un e-mail avec les
                                                                    instructions pour réinitialiser votre mot de passe.
                                                                </AlertDescription>
                                                            </Alert>
                                                            <Button
                                                                onClick={() => {
                                                                    setForgotPasswordOpen(false)
                                                                    setResetEmailSent(false)
                                                                    setResetEmail("")
                                                                }}
                                                                className="w-full"
                                                            >
                                                                Fermer
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <form onSubmit={handleResetPassword} className="space-y-4 py-4">
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="reset-email">Email</Label>
                                                                <Input
                                                                    id="reset-email"
                                                                    type="email"
                                                                    value={resetEmail}
                                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                                    placeholder="m@example.com"
                                                                    required
                                                                />
                                                            </div>
                                                            <DialogFooter>
                                                                <Button type="submit" className="w-full">
                                                                    Envoyer les instructions
                                                                </Button>
                                                            </DialogFooter>
                                                        </form>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
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

                                {!isLogin && (
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
                                )}

                                <Button type="submit" className="w-full py-6 text-base font-medium mt-2" disabled={isSubmitting}>
                                    {isSubmitting ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </CardContent>

                <CardFooter className="px-6 py-4 flex flex-col gap-4">
                    <div className="text-center text-sm">
                        {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}{" "}
                        <Link
                            to={`?mode=${isLogin ? "register" : "login"}`}
                            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                        >
                            {isLogin ? "S'inscrire" : "Se connecter"}
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                En cliquant sur Continuer, vous acceptez nos <a href="#">Conditions d'utilisation</a> et notre{" "}
                <a href="#">Politique de confidentialité</a>
            </div>
        </div>
    );
}

export default LoginForm

