import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Form, Link, useActionData, useSearchParams , useNavigation} from "react-router-dom"
import { ActionData } from "@/assets/modelData"
export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get("mode") === "login";
    const data = useActionData<ActionData>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Bienvenue de retour !</CardTitle>
                    <CardDescription>
                        Connectez-vous avec votre compte Sonatrach.
                        {data?.error?.msg && (
                            <ul>
                                <li className="text-red-300 font-bold mt-2">{data.error.msg}</li>
                            </ul>
                        )}
                        {Array.isArray(data?.error?.msg) ? 
                            (<ul>
                                {data.error.msg.map((ele, index) => {
                                    return <li key={index}>{ele}</li>
                                })}
                            </ul>)  : null
                    }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form method="post">
                        <div className="grid gap-6">
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    {isLogin ? "Or continue with" : "Créez un compte"}
                                </span>
                            </div>
                            <div className="grid gap-6">
                                {!isLogin && (<div className="grid gap-2">
                                    <div>
                                        <Label htmlFor="Name">Nom & Prénom</Label>
                                        <Input
                                            id="nom"
                                            type="nom"
                                            name="name"
                                            placeholder="votre nom"
                                            required
                                        />
                                    </div>
                                </div>)}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        {isLogin && (<a
                                            href="#"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Mot de passe oublié ?
                                        </a>)}
                                    </div>
                                    <Input id="password" type="password" required name="password" />
                                </div>
                                {!isLogin && (<div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Confirmation mots de pass</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"

                                        required
                                    />
                                </div>)}
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Loading..." : isLogin ? "Login" : "Register"}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                {isLogin ? "Vous n'avez pas de compte ?" : "J'ai un compte."}{" "}
                                <Link to={`?mode=${isLogin ? 'register' : 'login'}`} className="underline underline-offset-4">
                                    {isLogin ? 'Sign up' : 'Login'}
                                </Link>
                            </div>
                        </div>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                En cliquant sur Continuer, vous acceptez nos <a href='#'>Conditions d'utilisation</a> et notre <a href='#'>Politique de confidentialité</a>
            </div>
        </div>
    );
}
export default LoginForm
