import UsersTable from "@/components/Tables/employes-table";
import TableSkeleton from "@/components/Tables/TableSketlon";
import { EmployeeActions } from "@/store/EmployesSlice";
import { AppDispatch, RootState } from "@/store/indexD";
import { getAuthToken, getYearExercice } from "@/util/Auth";
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
                        <div className="flex flex-col md:flex-row items-center mb-8">
                            <div className="flex items-center mb-4 md:mb-0">
                                <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                            </div>
                            <div className="text-center md:text-start font-raleway">
                                <h1 className="text-3xl md:text-3xl font-bold text-[#F7913D] tracking-tight">
                                    Liste Employée {getYearExercice()}
                                </h1>
                            </div>
                        </div>
                        <TableSkeleton rows={20} columns={5} />
                    </div>
                ) : <>
                    <div className="flex flex-col md:flex-row items-center mb-8">
                        <div className="flex items-center mb-4 md:mb-0">
                            <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                        </div>
                        <div className="text-center md:text-start font-raleway">
                            <h1 className="text-3xl md:text-3xl font-bold text-[#F7913D] tracking-tight">
                            Liste Employée {getYearExercice()}
                            </h1>
                        </div>
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
