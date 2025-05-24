import NotificationError from "@/components/Error/NotificationError";
import PrevisionTable from "@/components/Tables/Table-Prevision";
import TableSkeleton from "@/components/Tables/TableSketlon";
import { AppDispatch, RootState } from "@/store/indexD";
import { PrevisionActions } from "@/store/PrevisionSlice";
import { getAuthToken, getYearExercice } from "@/util/Auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PlanPrevision() {
    const dispatch = useDispatch<AppDispatch>();
    const refrchData = useSelector((state :RootState)=> state.PlanPrevision.refrechData)
    const ListePrevision = useSelector((state: RootState) => state.PlanPrevision.ListePrevision);
    const IsLoading = useSelector((state: RootState) => state.PlanPrevision.IsLoading);
    const { IsVisible, status, message } = useSelector((state: RootState) => state.PlanPrevision.notification);
    const token = getAuthToken();  
    const Year = getYearExercice()
    useEffect(() => {
        if (IsVisible) {
            setTimeout(() => {
                dispatch(PrevisionActions.ClearNotification());
            }, 8000);
        }
    }, [dispatch, IsVisible]);
    useEffect(() => {
        const SendEmployeData = async () => {
            dispatch(PrevisionActions.ShowNotificationRefrech(true));
            const response = await fetch("http://127.0.0.1:8000/api/previsions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`,
                    "Year" : Year ?? ''
                }
            });
            const data = await response.json();
            dispatch(PrevisionActions.FetchDataPrevision(data.Plan))
            dispatch(PrevisionActions.ShowNotificationRefrech(false));
        }
        SendEmployeData()
    }, [token, dispatch , refrchData]);
    
    return (
        <>
            {IsLoading ?
                (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col md:flex-row items-center mb-8">
                                <div className="flex items-center mb-4 md:mb-0">
                                    <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                                </div>
                                <div className="text-center md:text-start font-raleway">
                                    <h1 className="text-3xl md:text-3xl font-bold text-[#F7913D] tracking-tight">
                                        PLAN PRÉVISION {getYearExercice()}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <TableSkeleton rows={15} columns={5} />
                    </div>
                ) : <>
                    <div>
                        <div className="flex flex-col md:flex-row items-center mb-8">
                            <div className="flex items-center mb-4 md:mb-0">
                                <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                            </div>
                            <div className="text-center md:text-start font-raleway">
                                <h1 className="text-3xl md:text-3xl font-bold text-[#F7913D] tracking-tight">
                                    PLAN PRÉVISION {getYearExercice()}
                                </h1>
                            </div>
                        </div>
                        {/* <p className="text-gray-600 pl-1">
                            Cette section est dédiée à la gestion des Plan Prévision de l'entreprise Sonatrach.
                        </p> */}
                    </div>
                    <PrevisionTable data={ListePrevision} />
                </>
            }

            <NotificationError
                isVisible={IsVisible}
                status={status}
                message={message}
            />
            
        </>
    );
}