import NotificationError from "@/components/Error/NotificationError";
import NotifeTable from "@/components/Tables/Table-PlnaNotifé";
import TableSkeleton from "@/components/Tables/TableSketlon";
import { AppDispatch, RootState } from "@/store/indexD";
import { NotifeeActions } from "@/store/NotifeSlice";
import { getAuthToken, getYearExercice } from "@/util/Auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PlanNotifie() {


    const dispatch = useDispatch<AppDispatch>();
    const refrchData = useSelector((state :RootState)=> state.PlanNotifee.refrechData)
    const ListeNotife = useSelector((state: RootState) => state.PlanNotifee.PlanNotifeeData);
    const IsLoading = useSelector((state: RootState) => state.PlanNotifee.IsLoading);
    const { IsVisible, status, message } = useSelector((state: RootState) => state.PlanNotifee.Notification);
    const token = getAuthToken();  
    const Year = getYearExercice()
    useEffect(() => {
        if (IsVisible) {
            setTimeout(() => {
                dispatch(NotifeeActions.ClearNotification());
            }, 8000);
        }
    }, [dispatch, IsVisible]);
    useEffect(() => {
        const SendEmployeData = async () => {
            dispatch(NotifeeActions.ShowNotificationRefrech(true));
            const response = await fetch("http://127.0.0.1:8000/api/plannotifie", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`,
                    "Year" : Year ?? ''
                }
            });
            const data = await response.json();
            dispatch(NotifeeActions.FetchDataPlanNotifee(data.Plan))
            dispatch(NotifeeActions.ShowNotificationRefrech(false));
        }
        SendEmployeData()
    }, [token, dispatch, refrchData]);
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
                                        PLAN FORMATION {getYearExercice()}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <TableSkeleton rows={15} columns={5} />
                    </div>
                ) : <>
                    <div className="flex flex-col md:flex-row items-center mb-8">
                        <div className="flex items-center mb-4 md:mb-0">
                            <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                        </div>
                        <div className="text-center md:text-start font-raleway">
                            <h1 className="text-3xl md:text-3xl font-bold text-[#F7913D] tracking-tight">
                                PLAN FORMATION {getYearExercice()}
                            </h1>
                        </div>
                    </div>
                    <NotifeTable data={ListeNotife} />
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