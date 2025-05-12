import { fields, User } from "@/assets/modelData";
import { DynamicInsertForm } from "@/components/Tools/InsertForm";
import { EmployeeActions } from "@/store/EmployesSlice";
import { AppDispatch } from "@/store/indexD";
import { getAuthToken } from "@/util/Auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function EmployeFormInsert() {
    const navigate = useNavigate();
    const token = getAuthToken();
    const dispatch = useDispatch<AppDispatch>();


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
                dispatch(EmployeeActions.ShowNotification({
                    IsVisible: true,
                    status: errorData.success ? "success" : "failed",
                    message: "error de créer un employé",
                }));
                return navigate('/homePage/Employee')
            }
    
        const data = await response.json();
        dispatch(EmployeeActions.ShowNotification({
            IsVisible: true,
            status: data.success ? "success" : "failed",
            message: data.message,
        }));
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
