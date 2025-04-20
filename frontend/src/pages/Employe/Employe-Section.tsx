import UsersTable from "@/components/Tables/employes-table";
import TableSkeleton from "@/components/Tables/TableSketlon";
import { EmployeeActions } from "@/store/EmployesSlice";
import { AppDispatch, RootState } from "@/store/indexD";
import { getAuthToken } from "@/util/Auth";
import { Skeleton } from "@heroui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationError from "../../components/Error/NotificationError";

function Employee() {
    const dispatch = useDispatch<AppDispatch>();
    const EmployeData = useSelector((state: RootState) => state.employees.employees) 
    const refrechData = useSelector((state: RootState) => state.employees.refrechData);
    const IsLoading = useSelector((state: RootState) => state.employees.IsLoading);
    const {IsVisible , status , message} = useSelector((state : RootState) => state.employees.notification)
    const token = getAuthToken();
    useEffect(() => {
        const SendEmployeData = async () => {
            dispatch(EmployeeActions.ShowNotificationRefrech(true));
            const response = await fetch("http://127.0.0.1:8000/api/employes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            dispatch(EmployeeActions.FetchDataEmployee(data.employes))
            dispatch(EmployeeActions.ShowNotificationRefrech(false));
        }
        SendEmployeData()
    }, [dispatch, token , refrechData]);

    useEffect(() => {
        if (IsVisible) {
            setTimeout(() => {
                dispatch(EmployeeActions.ClearNotification());
            }, 5000)
        }
    }, [dispatch, IsVisible]);
    return (
        <>
            {IsLoading ?
                (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Liste Employés</h2>
                            <Skeleton className="h-9 w-24" />
                        </div>
                        <TableSkeleton rows={20} columns={5} />
                    </div>
                ) : <>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Liste Employés</h2>
                        <p className="text-gray-600 pl-1">
                            Cette section est dédiée à la gestion des employés de l'entreprise Sonatrach.
                        </p>
                    </div>
                    <UsersTable data={EmployeData} />
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
export default Employee;
