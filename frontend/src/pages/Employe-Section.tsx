import UsersTable from "@/components/Tables/employes-table";
import { EmployeeActions } from "@/store/EmployesSlice";
import { AppDispatch, RootState } from "@/store/indexD";
import { getAuthToken } from "@/util/Auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// import { Skeleton } from "@/components/ui/skeleton";
// import TableSkeleton from "@/components/Tables/TableSketlon";

function Employee() {
    const dispatch = useDispatch<AppDispatch>();
    const EmployeData = useSelector((state: RootState) => state.employees.employees) 
    const refrechData = useSelector((state : RootState) => state.employees.refrechData)
    const {IsVisible , status , message} = useSelector((state : RootState) => state.employees.notificationDelete)
    const token = getAuthToken();
    useEffect(() => {
        const SendEmployeData = async () => {
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
        }
        SendEmployeData()
    }, [dispatch, token , refrechData]);

    useEffect(() => {
        if (IsVisible) {
            setTimeout(() => {
                dispatch(EmployeeActions.ClearNotificationDelete());
            }, 5000)
        }
    }, [dispatch, IsVisible]);
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
        <div className="relative"> {/* Added relative positioning for notification */}
            <h2 className="text-2xl font-bold mb-4">Employees</h2>
            
            {/* Notification positioned top left */}
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

            <UsersTable data={EmployeData} />
        </div>
    );
}

export default Employee;





            // <div className="space-y-4">
            //     <div className="flex items-center justify-between">
            //         <h2 className="text-2xl font-bold">Employees</h2>
            //         <Skeleton className="h-9 w-24" /> {/* Placeholder for any action button */}
            //     </div>
            //     <TableSkeleton rows={15} columns={5} />
            // </div>
//         body: JSON.stringify(dataAuth),
//     });