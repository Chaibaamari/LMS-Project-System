import { FieldConfigPlan} from "@/assets/modelData";
import { DynamicInsertForm } from "@/components/Tools/InsertForm";
import { AppDispatch, RootState } from "@/store/indexD";
import { NotifeeActions } from "@/store/NotifeSlice";
import { PrevisionActions } from "@/store/PrevisionSlice";
import { getAuthToken } from "@/util/Auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function PlanNotifieeFormUpdate() {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const token = getAuthToken();
    interface FormationOption {
    key: number;
    value: number;
    label: string;
    };
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
        ID_N: "",
        ID_Formation: "",
        Matricule: "",
        Observation: "-",
        Mode_Financement: 0,
        Frais_Pedagogiques: 0,
        Frais_Hebergement: 0,
        Frais_Transport: 0,
        Type_Pension: "-",
        Observation_pre_arbitrage: "-",
        Observation_arbitrage: "-",
        Autres_charges: 0,
        Presalaire: 0,
        Dont_Devise: 0,
    });
        
    const fieldsPlan: FieldConfigPlan[] = [
        { type: "input", name: "ID_N", label: "ID Plan Prévision" },
        { type: "input", name: "Matricule", label: "Matricule" },
        {
            type: "select",
            name: "ID_Formation",
            label: "Formation",
            options: Formation.map((formation: FormationOption) => ({
                key: formation.key,
                value: formation.value,
                label: formation.label,
            }))
        },
        { type: "input", name: "Observation", label: "Observation" },
        { type: "input", name: "Observation_arbitrage", label: "Observation_arbitrage" },
        { type: "number", name: "Autres_charges", label: "Autres_charges" },
        { type: "input", name: "Observation_pre_arbitrage", label: "Observation_pre_arbitrage" },
        { type: "number", name: "Mode_Financement", label: "Mode_Financement (KDA)" },
        { type: "number", name: "Frais_Pedagogiques", label: "Frais_Pedagogiques (KDA)" },
        { type: "number", name: "Frais_Hebergement", label: "Frais_Hebergement (KDA)" },
        { type: "number", name: "Frais_Transport", label: "Frais_Transport (KDA)" },
        { type: "number", name: "Presalaire", label: "Presalaire" },
        { type: "number", name: "Dont_Devise", label: "Dont_Devise" },
        {
            type: "select",
            name: "Type_Pension",
            label: "Type De Pension",
            options: [
                { value: "PENSION COMPLETE", label: " PENSION COMPLETE" },
                { value: "DEMI PENSION", label: "DEMI PENSION" }
            ]
        },
    ];
        const handleInputChange = <K extends keyof typeof editFormData>(name: K, value: typeof editFormData[K]) => {
            setEditFormData((prev) => ({ ...prev, [name]: value }));
    
    };
    // useEffect(() => {
    //     console.log("Formation data:", Formation.key);
    //     const duplicateIds = Formation
    //         .map(f => f.value)
    //         .filter((value, index, self) => self.indexOf(value) !== index);
    //     if (duplicateIds.length > 0) {
    //         console.warn("Duplicate formation IDs found:", duplicateIds);
    //     }
    // }, [Formation]);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Submitting form with data:", editFormData);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/plannotifie/modify`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...editFormData,
                        ID_Formation: Number(editFormData.ID_Formation)
                    }),
                }
            );

        if (!response.ok) {
            const errorData = await response.json();
            dispatch(NotifeeActions.ShowNotification({
                IsVisible: true,
                status: "failed",
                message:errorData.message,
            }));
            return navigate('/homePage/planNotifie');
        }

        const data = await response.json();
        dispatch(NotifeeActions.ShowNotification({
            IsVisible: true,
            status: "success",
            message: data.message,
        }));
        console.log(editFormData)
        navigate('/homePage/planNotifie');
        } catch (err) {
            console.log(err)
        }
    };
    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     try {
    //         const response = await fetch(
    //             `http://127.0.0.1:8000/api/plannotifie/modify`,
    //             {
    //                 method: '',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Accept: 'application/json',
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //                 body: JSON.stringify({
    //                     ID_N: editFormData.ID_N,
    //                     ID_Formation: Number(editFormData.ID_Formation),
    //                     Matricule: editFormData.Matricule,
    //                     Observation: editFormData.Observation,
    //                     Mode_Financement: editFormData.Mode_Financement,
    //                     Frais_Pedagogiques: editFormData.Frais_Pedagogiques,
    //                     Frais_Hebergement: editFormData.Frais_Hebergement,
    //                     Frais_Transport: editFormData.Frais_Transport,
    //                     Type_Pension: editFormData.Type_Pension,
    //                     Observation_pre_arbitrage: editFormData.Observation_pre_arbitrage,
    //                     Observation_arbitrage: editFormData.Observation_arbitrage,
    //                     Autres_charges: editFormData.Autres_charges,
    //                     Presalaire: editFormData.Presalaire,
    //                     Dont_Devise: editFormData.Dont_Devise,
    //                 }),
    //             }
    //         );
    
    //         // First, clone the response to read it twice if needed
    //         const responseClone = response.clone();
            
    //         try {
    //             const data = await response.json();
                
    //             if (!response.ok) {
    //                 dispatch(NotifeeActions.ShowNotification({
    //                     IsVisible: true,
    //                     status: data.success ? "success" : "failed",
    //                     message: data.message || "Erreur lors de la mise à jour",
    //                 }));
    //                 navigate('/homePage/planNotifie');
    //                 return;
    //             }
    
    //             // If successful
    //             dispatch(NotifeeActions.ShowNotification({
    //                 IsVisible: true,
    //                 status: "success",
    //                 message: data.message,
    //             }));
    //             console.log(editFormData);
    //             navigate('/homePage/planNotifie');
    //         } catch (err) {
    //             // If JSON parsing fails
    //             const text = await responseClone.text();
    //             dispatch(NotifeeActions.ShowNotification({
    //                 IsVisible: true,
    //                 status: "failed",
    //                 message: text || "Erreur inconnue",
    //             }));
    //             navigate('/homePage/planNotifie');
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         dispatch(NotifeeActions.ShowNotification({
    //             IsVisible: true,
    //             status: "failed",
    //             message: "Erreur réseau ou serveur",
    //         }));
    //     }
    // };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/previsions/modify/${params.ID_N}`,
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
                    ID_N: data.data.ID_N,
                    ID_Formation: data.data.ID_Formation,
                    Matricule: data.data.Matricule,
                    Observation: data.data.Observation,
                    Mode_Financement: data.data.Mode_Financement,
                    Frais_Pedagogiques: data.data.Frais_Pedagogiques,
                    Frais_Hebergement: data.data.Frais_Hebergement,
                    Frais_Transport: data.data.Frais_Transport,
                    Type_Pension: data.data.Type_Pension,
                    Observation_pre_arbitrage: data.data.Observation_pre_arbitrage,
                    Observation_arbitrage: data.data.Observation_arbitrage,
                    Autres_charges: data.data.Autres_charges,
                    Presalaire: data.data.Presalaire,
                    Dont_Devise: data.data.Dont_Devise,
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
                fields={fieldsPlan}
                UrlRelaod="/homePage/planNotifie"
            />
        </>
    );
}