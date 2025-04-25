import NotificationError from "@/components/Error/NotificationError";
import NotifeTable from "@/components/Tables/Table-PlnaNotifé";
import TableSkeleton from "@/components/Tables/TableSketlon";
import { Skeleton } from "@/components/ui/skeleton";
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
                            <h2 className="text-2xl font-bold">Plan Notifée</h2>
                            <Skeleton className="h-9 w-24" /> 
                        </div>
                        <TableSkeleton rows={15} columns={5} />
                    </div>
                ) : <>
                    <h2 className="text-2xl font-bold mb-4">Plan Notifée</h2>
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