import { fields, User } from "@/assets/modelData";
import { DynamicInsertForm } from "@/components/Tools/InsertForm";
import { getAuthToken } from "@/util/Auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeFormUpdate() {
    const navigate = useNavigate();
    const params = useParams();

    const [editFormData, setEditFormData] = useState<User>({
        Matricule: params.matricule as string,
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
        const response = await fetch(
            `http://127.0.0.1:8000/api/employes/edit/${params.matricule}`,
            {
                method: 'PUT',
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
        console.log('Update successful:', data.success);
        navigate('/homePage/Employee')
    };
    const token = getAuthToken();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/employes/edit/${params.matricule}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    },
                )
                const data = await response.json();
                setEditFormData((prevData) => ({
                    ...prevData,
                    Matricule: data.data.Matricule || "",
                    prenomnom: data.data.prenomnom || "",
                    Date_Naissance: data.data.Date_Naissance || "",
                    Date_Recrutement: data.data.Date_Recrutement || "",
                    Sexe: data.data.Sexe || "",
                    CSP: data.data.CSP || "",
                    Echelle: data.data.Echelle || "",
                    CodeFonction: data.data.CodeFonction || "",
                    Id_direction: data.data.Id_direction || "",
                }));
            } catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, []);
    return (
        <>
            <DynamicInsertForm
                handleSubmit={handleSubmit}
                editFormData={editFormData}
                handleInputChange={handleInputChange}
                fields={fields}
                UrlRelaod="/homePage/planPrevision"
            />
        </>
    );
}