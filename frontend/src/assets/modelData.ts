export interface ActionData {
    error?: {
        msg: string | string [];
    };
    message?: string;
};
// interface Fonction {
//     CodeFonction: number;
//     TypeFonction: string; // Assuming these are the possible values
//     IntituleFonction: string;
// }

export type Users = {
    Matricule: string
    prenomnom: string
    Date_Naissance: string
    Date_Recrutement: string
    Age: number
    Ancienneté: number
    Sexe: string;
    CSP: string;
    fonction: {
        TypeFonction: string,
        IntituleFonction: string;
    }
    Echelle: string
    CodeFonction: string
    Id_direction: string
};
export type User = {
    Matricule: string
    prenomnom: string
    Date_Naissance: string
    Date_Recrutement: string
    Sexe: string;
    CSP: string;
    Echelle: string
    CodeFonction: string
    Id_direction: string
};

export type currentUser = {
    name: string
    email: string
};

export type FieldConfig = {
    type: "input" | "select" | "date" | "number"; // Type of the field
    name: keyof User; // Name of the field (used for form data)
    label: string; // Label for the field
    placeholder?: string; // Optional placeholder text
    options?: { value: string; label: string }[]; // Options for select fields
};

// Define sort direction type
export type SortDirection = "asc" | "desc" | null

// Define sort state type
export type SortState = {
    column: keyof Users | null
    direction: SortDirection
};

export const fields: FieldConfig[] = [
    { type: "input", name: "Matricule", label: "Matricule" },
    { type: "input", name: "prenomnom", label: "Nom & Prénom" },
    { type: "date", name: "Date_Naissance", label: "Date de Naissance" },
    { type: "date", name: "Date_Recrutement", label: "Date de Recrutement" },
    { type: "number", name: "CodeFonction", label: "Code Fonction" },
    { type: "input", name: "Echelle", label: "Echelle (degree)" },
    { type: "input", name: "Id_direction", label: "Direction" },
    {
        type: "select",
        name: "Sexe",
        label: "Sexe",
        options: [
            { value: "M", label: "M" },
            { value: "F", label: "F" },
        ],
    },
    {
        type: "select",
        name: "CSP",
        label: "CSP",
        options: [
            { value: "Cadre", label: "Cadre" },
            { value: "Maîtrise", label: "Maîtrise" },
            { value: "Exécution", label: "Exécution" },
        ],
    },
];