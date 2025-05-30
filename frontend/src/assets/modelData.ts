export interface ActionData {
    error?: {
        msg: string | string [];
    };
    message?: string;
};
export interface Direction {
    Id_direction: string;
    Nom_direction: string;
    Structure: string;
    NomResponsable: string | null;
    Email: string | null;
}
export interface Fonction {
    CodeFonction: string;
    TypeFonction: string; // Assuming these are the possible values
    IntituleFonction: string;
}

export interface Employe {
    Matricule: string;
    prenomnom: string;
    Date_Naissance: string;
    Date_Recrutement: string;
    Sexe: string;
    CSP: string;
    Echelle: string;
    CodeFonction: string;
    Id_direction: string;
    direction: Direction;
    fonction: Fonction;
}

export interface Organisme {
    Id_Organisme: number;
    Code_Organisme: string;
    Nom_Organisme: string;
    Lieu_Formation: string;
    Pays: string;
}

export interface Formation {
    ID_Formation: number;
    Domaine_Formation: string;
    Code_Domaine_Formation: string;
    Intitule_Action: string;
    Niveau_Formation: string;
    Nature_Formation: string;
    Source_Besoin: string;
    Type_Formation: string;
    Mode_Formation: string;
    Code_Formation: string;
    Heure_jour: number;
    Id_Organisme: number;
    organisme: Organisme;
}

export interface FormationEnCours {
    ID_Formation: number;
    Intitule_Action: string;
    Date_Deb: string
    Date_fin: string
    pourcentage: number,
    days_remaining: number
};
export interface FormationTermine {
    ID_Formation: number
      Intitule_Action: string
      
  }

export interface PlanPrevision extends Record<string, unknown> {
    ID_N: number;
    Observation: string | null;
    Date: Date | null;
    // Date_Deb: string | null;
    // Date_fin: string | null;
    // Budget: strign | null;
    Matricule: string;
    ID_Formation: number;
    Mode_Financement: string | null;
    Frais_Pedagogiques: number | null;
    Frais_Hebergement: number | null;
    Frais_Transport: number | null;
    type: string | null;
    employe: Employe;
    formation: Formation;
}

export interface PlanNotifee extends Record<string, unknown>{
    ID_N: number;
    Observation: string | null;
    Date: Date | null;
    Date_Deb: Date | null;
    Date_fin: Date | null;
    Matricule: string;
    ID_Formation: number;
    Mode_Financement: number | null;
    Frais_Pedagogiques: number | null;
    Frais_Hebergement: number | null;
    Frais_Transport: number | null;
    Type_Pension: string | null;
    Budget: string | null;
    Observation_pre_arbitrage: string;
    Observation_arbitrage: string;
    Autres_charges: number;
    Presalaire: number;
    Dont_Devise : number;
    employe: Employe;
    formation: Formation;
}
export interface TBF  {
    message: string;
    Nom: string;
    date_creation: string;
    Plans: PlanPrevision[];
}



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
    role: string
};

export type FieldConfig = {
    type: "input" | "select" | "date" | "number"; // Type of the field
    name: keyof User; // Name of the field (used for form data)
    label: string; // Label for the field
    placeholder?: string; // Optional placeholder text
    options?: { value: string; label: string }[]; // Options for select fields
};

export type FieldConfigPlan = {
    type: "input" | "select" | "date" | "number"; // Type of the field
    name: keyof PlanPrevision; // Name of the field (used for form data)
    label: string; // Label for the field
    placeholder?: string; // Optional placeholder text
    options?: { value: number | string ; label: string; }[];
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
    { type: "input", name: "CodeFonction", label: "Code Fonction" },
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


export interface BondCommand {
    ID_N: number;
    Structure: string;
    Nom_direction: string;
    Matricule: string;
    prenomnom: string;
    Date_Naissance: string;
    Sexe: string;
    CSP: string;
    Id_direction: string;
    CodeFonction: string;
    Domaine_Formation: string;
    Code_Domaine_Formation: string;
    Intitule_Action: string;
    Nature_Formation: string;
    Source_Besoin: string;
    Type_Formation: string;
    Mode_Formation: string;
    Code_Formation: string;
    Code_Organisme: string;
    Nom_Organisme: string;
    Lieu_Formation: string;
    Pays: string;
    Date_Deb: Date | null;
    Date_fin: Date | null;
    Heure_jour: number;
    Type_Pension: string | null;
    Observation: string | null;
    Budget: string | null;
};



