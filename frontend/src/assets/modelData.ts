export interface ActionData {
    error?: {
        msg: string | string [];
    };
    message?: string;
}

export type Users = {
    Matricule: string
    Nom: string
    Prénom: string
    Date_Naissance: string
    Age: number
    Ancienneté: number
    Sexe: 'M' | 'F';
    CSP: 'Cadre' | 'Maîtrise' | 'Exécution';
    Fonction: string
    Echelle: string
    CodeFonction: number
    Id_direction: string
}

export type FieldConfig  = {
    type: "input" | "select" | "date" | "number"; // Type of the field
    name: string; // Name of the field (used for form data)
    label: string; // Label for the field
    placeholder?: string; // Optional placeholder text
    options?: { value: string; label: string }[]; // Options for select fields
}

export type User = {
    id: number
    name: string
    email: string
    status: string
    role: string
    matricule: string
    nom: string
    prenom: string
    date_naissance: string
    age: number
    anciennete: number
    sexe: string
    csp: string
    codeFonction: string
}

// Define sort direction type
export type SortDirection = "asc" | "desc" | null

// Define sort state type
export type SortState = {
    column: keyof User | null
    direction: SortDirection
}
