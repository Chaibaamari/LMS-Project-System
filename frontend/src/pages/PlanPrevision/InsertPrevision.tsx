import { FieldConfigPlan } from "@/assets/modelData";
import { DynamicInsertForm } from "@/components/Tools/InsertForm";
import { AppDispatch, RootState } from "@/store/indexD";
import { PrevisionActions } from "@/store/PrevisionSlice";
import { getAuthToken } from "@/util/Auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function EmployeFormInsert() {
    const navigate = useNavigate();
    const token = getAuthToken();
    const dispatch = useDispatch<AppDispatch>();
//     interface FormationOption {
//     value: string;
//     label: string;
// }
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

            dispatch(PrevisionActions.GetAllFormation(data.Formation))
        }
        fetchAllFormation()
    }, [token, dispatch ]);
    const [editFormData, setEditFormData] = useState({
        Matricule: "",
        Intitule_Action:"",
    });
    
    const fieldsPlan: FieldConfigPlan[] = [
        { type: "input", name: "Matricule", label: "Matricule" },
        // { type: "input", name: "Observation", label: "Observation" },
        // { type: "date", name: "Date", label: "Date" },
        // { type: "number", name: "Mode_Financement", label: "Mode_Financement" },
        // { type: "number", name: "Frais_Pedagogiques", label: "Frais_Pedagogiques" },
        // { type: "number", name: "Frais_Hebergement", label: "Frais_Hebergement" },
        // { type: "number", name: "Frais_Transport", label: "Frais_Transport" },
        {
            type: "select",
            name: "Intitule_Action",
            label: "Formation",
            // options: [
            //     // Use a special value like "null" instead of empty string
            //     { id : 0 ,  value: "null", label: "Select a formation" },
            //     ...Formation.map((formation: FormationOption) => ({
            //         id: formation.id,
            //         value: formation.value,
            //         label: formation.label,
            //     }))
            // ]
            options: Formation.map(intitule => ({
                value: intitule,
                label: intitule
            }))

        },
    ];
    // <option value="">Select a formation</option>
    //     {formations.map((formation, index) => (
    //       <option 
    //         key={index} 
    //         value={formation.Intitule_Action}
    //       >
    //         {formation.Intitule_Action} - {formation.Nom_Organisme} ({formation.Lieu_Formation})
    //       </option>
    //     ))}
    const handleInputChange = (name: keyof typeof editFormData, value: string) => {
        setEditFormData((prev) => ({ ...prev, [name]: value }))
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        if (editFormData.Intitule_Action === "null" || !editFormData.Intitule_Action) {
        dispatch(PrevisionActions.ShowNotification({
            IsVisible: true,
            status: 'failed',
            message: 'Please select a valid formation'
        }));
        return;
    }
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
                    },
                    body: JSON.stringify(editFormData),
                }
            );
    
            if (!response.ok) {
                const errorData = await response.json();
                dispatch(PrevisionActions.ShowNotification({
                IsVisible: true,
                status: 'failed',
                message: errorData || "Erreur lors de la création de la prévision"
                }));
                return navigate('/homePage/PlanPrevision');
            }
            dispatch(PrevisionActions.ShowNotification({
                IsVisible: true,
                status: 'success',
                message: 'Prévision ajoutée avec succès'
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
