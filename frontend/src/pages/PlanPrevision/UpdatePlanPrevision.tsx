import { FieldConfigPlan} from "@/assets/modelData";
import { DynamicInsertForm } from "@/components/Tools/InsertForm";
import { AppDispatch, RootState } from "@/store/indexD";
import { PrevisionActions } from "@/store/PrevisionSlice";
import { getAuthToken } from "@/util/Auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function PlanPrevisionFormUpdate() {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const token = getAuthToken();
    interface FormationOption {
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
    });
        
    const fieldsPlan: FieldConfigPlan[] = [
        { type: "input", name: "ID_N", label: "ID Plan Prévision" },
        // { type: "input", name: "Observation", label: "Observation" },
        // { type: "date", name: "Date", label: "Date" },
        // { type: "number", name: "Mode_Financement", label: "Mode_Financement" },
        // { type: "number", name: "Frais_Pedagogiques", label: "Frais_Pedagogiques" },
        // { type: "number", name: "Frais_Hebergement", label: "Frais_Hebergement" },
        // { type: "number", name: "Frais_Transport", label: "Frais_Transport" },
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
        event.preventDefault();
        const response = await fetch(
            `http://127.0.0.1:8000/api/previsions/modify/${params.ID_N}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ID_N: editFormData.ID_N,
                    ID_Formation: Number(editFormData.ID_Formation),
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            dispatch(PrevisionActions.ShowNotification({
                IsVisible: true,
                status: errorData.success ? "success" : "failed",
                message: errorData.message,
            }));
            navigate('/homePage/planPrevision');
        }

        const data = await response.json();
        console.log('Update successful:', data.success);
        navigate('/homePage/Employee')
    };
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
                    ID_Formation : data.data.ID_Formation
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
                UrlRelaod="/homePage/planPrevision"
            />
        </>
    );
}