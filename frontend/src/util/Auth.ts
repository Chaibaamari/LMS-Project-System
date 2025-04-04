import { Users } from "@/assets/modelData";
import { redirect } from "react-router-dom";

export function getTokenExpiration():number {
    const Storeexpiration = localStorage.getItem('expiration');
    const expirationDate = new Date(Storeexpiration || '');
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
}
export function getAuthToken(): string | null | 'EXPIRED' {
    const token = localStorage.getItem('token');
    const TokenExpiration = getTokenExpiration();

    if (!token) {
        return null;
    }
    if (TokenExpiration <= 0) {
        return 'EXPIRED';
    }

    return token;

}
export function LoadToken(): string {
  const token = getAuthToken();
  if (!token || token === "EXPIRED") {
      // This will trigger the errorElement (PageError)
    throw new Response( JSON.stringify({message : 'Unauthorized'}), {status : 401} )
  }
  return token;
}

export function ProtectedRoute() {
    const token = getAuthToken();
    if (!token) {
        return redirect('/?mode=login');
    }
    return null;
}


export const initialFormData: Users = {
    Matricule: "",
    prenomnom: "",
    Date_Naissance: "",
    Date_Recrutement: "",
    Age: 0,
    Ancienneté: 0,
    Sexe: "",
    CSP: "",
    fonction: {
        TypeFonction: "",
        IntituleFonction: "",
    },
    CodeFonction: "",
    Echelle: "",
    Id_direction: "" // Added missing property
};
export function calculateAge(dateOfBirth : Date): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    const age  = today.getFullYear() - birthDate.getFullYear();
    
    // Adjust age if the current month is before the birth month,
    // or if it's the birth month but the day hasn't occurred yet
    
    return age;
}
export function calculeAnciennete(date : Date): number {
    const birthDate = new Date(date);
    const today = new Date();
    
    const Anciennete  = today.getFullYear() - birthDate.getFullYear();
    
    // Adjust age if the current month is before the birth month,
    // or if it's the birth month but the day hasn't occurred yet
    
    return Anciennete;
}