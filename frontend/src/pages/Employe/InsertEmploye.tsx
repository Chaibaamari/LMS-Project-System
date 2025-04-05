import { fields, User } from "@/assets/modelData";
import { DynamicInsertForm } from "@/components/Tools/InsertForm";
import { getAuthToken } from "@/util/Auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeFormInsert() {
    const navigate = useNavigate();
    const token = getAuthToken();


    const [editFormData, setEditFormData] = useState<User>({
        Matricule: "",
        prenomnom: "",
        Date_Naissance: "",
        Date_Recrutement: "",
        Sexe: "",
        CSP: "",
        Echelle: "",
        CodeFonction: "",
        Id_direction: "",
    });
    
    const handleInputChange = (name: keyof typeof editFormData, value: string) => {
        setEditFormData((prev) => ({ ...prev, [name]: value }))
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            console.log(editFormData)
            const response = await fetch(
                `http://127.0.0.1:8000/api/employes/new`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editFormData),
                }
            );
    
            if (!response.ok) {
                const errorData = await response.json();
                return console.log(errorData);
            }
    
            const data = await response.json();
            navigate('/homePage/Employee')
            return data;
        };
    return (
        <>
            <DynamicInsertForm
                handleSubmit={handleSubmit}
                editFormData={editFormData}
                handleInputChange={handleInputChange}
                fields={fields}
                UrlRelaod="/homePage/Employee"
            />
        </>
    )
}
