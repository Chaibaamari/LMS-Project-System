import PrevisionTable from "@/components/Tables/Table-Prevision";
import TableSkeleton from "@/components/Tables/TableSketlon";
import { Skeleton } from "@/components/ui/skeleton";
import { AppDispatch, RootState } from "@/store/indexD";
import { PrevisionActions } from "@/store/PrevisionSlice";
import { getAuthToken } from "@/util/Auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PlanPrevision() {
    const dispatch = useDispatch<AppDispatch>();
    const refrchData = useSelector((state :RootState)=> state.PlanPrevision.refrechData)
    const ListePrevision = useSelector((state: RootState) => state.PlanPrevision.ListePrevision);
    const IsLoading = useSelector((state: RootState) => state.PlanPrevision.IsLoading);
    const { IsVisible, status, message } = useSelector((state: RootState) => state.PlanPrevision.notification);
    const token = getAuthToken();  
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
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            dispatch(PrevisionActions.FetchDataPrevision(data.Plan))
            dispatch(PrevisionActions.ShowNotificationRefrech(false));
        }
        SendEmployeData()
    }, [token, dispatch , refrchData]);
    const getNotificationStyle = () => {
        switch (status) {
            case 'pending':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'success':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };
    // Define status icon
    const getStatusIcon = () => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'success':
                return '✓';
            case 'failed':
                return '⚠';
            default:
                return '';
        }
    };
    return (
        <>
            {IsLoading ?
                (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Plan Prévision</h2>
                            <Skeleton className="h-9 w-24" /> 
                        </div>
                        <TableSkeleton rows={15} columns={5} />
                    </div>
                ) : <>
                    <h2 className="text-2xl font-bold mb-4">Plan Prévision</h2>
                    <PrevisionTable data={ListePrevision} />
                </>
            }

            {IsVisible && (
                <div className={`fixed top-4 right-4 z-50 p-3 rounded-md shadow-lg border ${getNotificationStyle()} animate-fade-in`}>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">{getStatusIcon()}</span>
                        <div>
                            <p className="font-medium capitalize">{status}</p>
                            <p>{message}</p>
                        </div>
                    </div>
                </div>
            )}
            
        </>
    );
}