import { redirect } from "react-router-dom";

export function getAuthToken(): string | null {
    return localStorage.getItem('token');
}
export function getAuthEmail(): string |null{
    return localStorage.getItem('emailUser');
}

export function ProtectedRoute() {
    const token = getAuthToken();
    if (!token) {
        return redirect('/?mode=login');
    }
    return null;
}