import { FieldConfigPlan } from "@/assets/modelData";
import { DynamicInsertForm } from "@/components/Tools/InsertForm";
import { AppDispatch, RootState } from "@/store/indexD";
import { PrevisionActions } from "@/store/PrevisionSlice";
import { getAuthToken, getYearExercice } from "@/util/Auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function EmployeFormInsert() {
    const navigate = useNavigate();
    const token = getAuthToken();
    const dispatch = useDispatch<AppDispatch>();
    const Year = getYearExercice()
    interface FormationOption {
    value: number;
    label: string;
}
    const Formation = useSelector((state: RootState) => state.PlanPrevision.ListeIntitulAction);
    useEffect(() => {
        const fetchAllFormation = async () => {
            const response = await fetch("http://127.0.0.1:8000/api/Formation/ListeFormation", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            dispatch(PrevisionActions.GetAllFormation(data.Formation));
        }
        fetchAllFormation()
    }, [token, dispatch ]);
    const [editFormData, setEditFormData] = useState({
        Matricule: "",
        ID_Formation: "",
    });
    
    const fieldsPlan: FieldConfigPlan[] = [
        { type: "input", name: "Matricule", label: "Matricule" },
        {
            type: "select",
            name: "ID_Formation",
            label: "Formation",
            options: Formation.map((formation: FormationOption) => ({
                value: formation.value,
                label: formation.label,
            }))
        },
    ];
    const handleInputChange = (name: keyof typeof editFormData, value: string) => {
        setEditFormData((prev) => ({ ...prev, [name]: value }));

    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            dispatch(PrevisionActions.ShowNotification({
                IsVisible: true,
                status: 'pending',
                message: 'en cours Insert ...'
            }));
            const response = await fetch(
                `http://127.0.0.1:8000/api/previsions/add`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        "Year" : Year ?? ''
                    },
                    body: JSON.stringify({
                        Matricule: editFormData.Matricule,
                        ID_Formation: Number(editFormData.ID_Formation),
                    }),
                }
            );
    
            const errorData = await response.json();
            if (!response.ok) {
                dispatch(PrevisionActions.ShowNotification({
                IsVisible: true,
                status: errorData.success ? 'success' : 'failed',
                message: errorData.message || "Erreur lors de la création de la prévision"
                }));
                return navigate('/homePage/PlanPrevision');
            }
            dispatch(PrevisionActions.ShowNotification({
                IsVisible: true,
                status: errorData.success ? 'success' : 'failed',
                message: errorData.message || "Erreur lors de la création de la prévision"
            }));
            navigate('/homePage/PlanPrevision');
        } catch (err) {
            dispatch(PrevisionActions.ShowNotification({
                IsVisible: true,
                status: 'failed',
                message: err || "Erreur lors de la création de la prévision"
            }));
            return navigate('/homePage/PlanPrevision');
        }
    };
    return (
        <>
            <DynamicInsertForm
                handleSubmit={handleSubmit}
                editFormData={editFormData}
                handleInputChange={handleInputChange}
                fields={fieldsPlan}
                UrlRelaod="/homePage/planPrevision"
            />
        </>
    )
}
