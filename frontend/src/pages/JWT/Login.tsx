
import { LoginForm } from "@/components/Auth/login-form"
import {redirect} from 'react-router-dom'


export default function LoginPage() {

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center text-center font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md  text-primary-foreground">
                        <img src="../../public/Sonatrach.svg" alt="" />
                    </div>
                    Sonatrach Gestion des Formation.
                </a>
                <LoginForm />
            </div>
        </div>
    );
}

export async function action({request} : {request: Request}) {
    const SearchUrl = new URL(request.url).searchParams; 
    const mode = SearchUrl.get('mode') || 'login';

    if (mode !== 'login' && mode !== 'register') {
        throw new Response( JSON.stringify({message : ' Error 2 de registration '}), {status : 422} )
    }

    const data = await request.formData();
    const dataAuth = {
        name : data.get('name') as string,
        email: data.get('email') as string,
        password: data.get('password') as string,
        password_confirmation: data.get('password_confirmation') as string,
    }
    console.log(dataAuth)
    const response = await fetch(`http://127.0.0.1:8000/api/${mode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataAuth),
    });
    if (response.status === 422 || response.status === 401 || response.status === 500) {
        return response;
    }

    if (!response.ok) {
        throw new Response( JSON.stringify({message : ' Error de registration '}), {status : 422} )
    }
    const resData = await response.json();
    console.log(resData)
    const token = resData.token;
    localStorage.setItem('token', token);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // Set expiration to 1 hour from now
    localStorage.setItem('expiration', expiration.toISOString());
    return redirect('/homePage')
    
}

// import this function of token i you must add in such route must be protected