import { fields, User } from "@/assets/modelData";
import { DynamicInsertForm } from "@/components/Tools/InsertForm";
import { EmployeeActions } from "@/store/EmployesSlice";
import { AppDispatch } from "@/store/indexD";
import { getAuthToken } from "@/util/Auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeFormUpdate() {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();

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
            dispatch(EmployeeActions.ShowNotification({
                IsVisible: true,
                status: errorData.success ? "success" : "failed",
                message: errorData.message,
            }));
            return navigate('/homePage/Employee')
        }
        const data = await response.json();
        dispatch(EmployeeActions.ShowNotification({
            IsVisible: true,
            status: data.success ? "success" : "failed",
            message: data.message,
        }));
        return navigate('/homePage/Employee')
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

                if (!response.ok) {
                    const errorData = await response.json();
                    dispatch(EmployeeActions.ShowNotification({
                        IsVisible: true,
                        status: errorData.success ? "success" : "failed",
                        message: errorData.message,
                    }));
                    return navigate('/homePage/Employee')
                }


                const data = await response.json();
                dispatch(EmployeeActions.ShowNotification({
                    IsVisible: true,
                    status: "pending",
                    message: data.message,
                }));
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
                dispatch(EmployeeActions.ShowNotification({
                    IsVisible: true,
                    status: "success",
                    message: data.message,
                }));
            } catch (err) {
                dispatch(EmployeeActions.ShowNotification({
                    IsVisible: true,
                    status: "failed",
                    message: `Une erreur s'est produite lors de la récupération des données ${err}.`,
                }));
                return navigate('/homePage/Employee')
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