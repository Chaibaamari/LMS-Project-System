import { FieldConfigPlan } from "@/assets/modelData";
import { DynamicInsertForm } from "@/components/Tools/InsertForm";
import { AppDispatch, RootState } from "@/store/indexD";
import { NotifeeActions } from "@/store/NotifeSlice";
import { getAuthToken, getYearExercice } from "@/util/Auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function PlanNotifieeFormInsert() {
    const navigate = useNavigate();
    const token = getAuthToken();
    const dispatch = useDispatch<AppDispatch>();
    const Year = getYearExercice()
    interface FormationOption {
    value: number;
    label: string;
}
    const Formation = useSelector((state: RootState) => state.PlanNotifee.ListeIntitulAction);
    useEffect(() => {
        const fetchAllFormation = async () => {
            const response = await fetch("http://127.0.0.1:8000/api/Formation/ListeFormation", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`,
                }
            });
            const data = await response.json();
            dispatch(NotifeeActions.GetAllFormation(data.Formation));
        }
        fetchAllFormation()
    }, [token, dispatch ]);
    const [editFormData, setEditFormData] = useState({
        ID_Formation: "",
        Matricule: "",
        Observation : "",
        Mode_Financement: 0,
        Frais_Pedagogiques: 0,
        Frais_Hebergement: 0,
        Frais_Transport: 0,
        Type_Pension: "",
        Budget: "",
        Observation_pre_arbitrage: "",
        Observation_arbitrage: "",
        Autres_charges: 0,
        Presalaire: 0,
        Dont_Devise : 0,
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
        { type: "input", name: "Observation", label: "Observation" },
        { type: "input", name: "Budget", label: "Budget" },
        { type: "input", name: "Observation_arbitrage", label: "Observation_arbitrage" },
        { type: "number", name: "Autres_charges", label: "Autres_charges" },
        { type: "input", name: "Observation_pre_arbitrage", label: "Observation_pre_arbitrage" },
        { type: "date", name: "Date", label: "Date" },
        { type: "number", name: "Mode_Financement", label: "Mode_Financement" },
        { type: "number", name: "Frais_Pedagogiques", label: "Frais_Pedagogiques" },
        { type: "number", name: "Frais_Hebergement", label: "Frais_Hebergement" },
        { type: "number", name: "Frais_Transport", label: "Frais_Transport" },
        { type: "number", name: "Presalaire", label: "Presalaire" },
        { type: "number", name: "Dont_Devise", label: "Dont_Devise" },
        {
            type: "select",
            name: "Type_Pension",
            label: "Type De Pension",
            options: [
                { value: "PENSION COMPLETE" , label:" PENSION COMPLETE"},
                { value: "DEMI PENSION" , label:"DEMI PENSION"}
            ]
        },
    ];
    const handleInputChange = <K extends keyof typeof editFormData>(name: K, value: typeof editFormData[K]) => {
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            dispatch(NotifeeActions.ShowNotification({
                IsVisible: true,
                status: 'pending',
                message: 'en cours Insert ...'
            }));
            const response = await fetch(
                `http://127.0.0.1:8000/api/plannotifie/add`,
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
                        Mode_Financement: editFormData.Mode_Financement,
                        Frais_Pedagogiques: editFormData.Frais_Pedagogiques,
                        Frais_Hebergement: editFormData.Frais_Hebergement,
                        Frais_Transport: editFormData.Frais_Transport,
                        Observation: editFormData.Observation,
                        Type_Pension: editFormData.Type_Pension,
                        Budget: editFormData.Budget,
                        Observation_pre_arbitrage: editFormData.Observation_pre_arbitrage,
                        Observation_arbitrage: editFormData.Observation_arbitrage,
                        Autres_charges: editFormData.Autres_charges,
                        Presalaire: editFormData.Presalaire,
                        Dont_Devise: editFormData.Dont_Devise,
                    }),
                }
            );
            console.log(editFormData)
            const errorData = await response.json();
            if (!response.ok) {
                dispatch(NotifeeActions.ShowNotification({
                IsVisible: true,
                status: errorData.success ? 'success' : 'failed',
                message: errorData.message || "Erreur lors de la création de la prévision"
                }));
                return navigate('/homePage/planNotifie');
            }
            dispatch(NotifeeActions.ShowNotification({
                IsVisible: true,
                status: errorData.success ? 'success' : 'failed',
                message: errorData.message || "Erreur lors de la création de la prévision"
            }));
            navigate('/homePage/planNotifie');
        } catch (err) {
            dispatch(NotifeeActions.ShowNotification({
                IsVisible: true,
                status: 'failed',
                message: err || "Erreur lors de la création de la prévision"
            }));
            return navigate('/homePage/planNotifie');
        }
    };
    return (
        <>
            <DynamicInsertForm
                handleSubmit={handleSubmit}
                editFormData={editFormData}
                handleInputChange={handleInputChange}
                fields={fieldsPlan}
                UrlRelaod="/homePage/planNotifie"
                // showError = {true}
            />
        </>
    )
}
