import UsersTable from "@/components/Tables/employes-table";
import { useSelector , useDispatch } from "react-redux";
import { AppDispatch, fetchEmployees, RootState } from "@/app/store"; // Adjust the path to your store file
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/components/Tables/TableSketlon";

function Employee(){
    const dispatch = useDispatch<AppDispatch>();
    const {employees , status , error} = useSelector((state: RootState) => state.employees);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchEmployees());
        }
    }, [status, dispatch]);

    if (status === "loading") {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Employees</h2>
                    <Skeleton className="h-9 w-24" /> {/* Placeholder for any action button */}
                </div>
                <TableSkeleton rows={15} columns={5} />
            </div>
        );
    }

    if (status === 'failed') {
    return <div>Error: {error}</div>;
    };
    return (
        <>  
            <h2 className="text-2xl font-bold">Employees</h2>
            <UsersTable data={employees}  />
        </>
    );
}

export default Employee;


// export const Loader = async () => {
//     const token = getAuthToken();
//     const response = await fetch("http://127.0.0.1:8000/api/Employes", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}` // Include the token in the request
//         }
//     });
//     const data = await response.json();
//     return data.employes;
// }

// export const action: ActionFunction = async ({ request }) => {
//     const token = getAuthToken();
//     const data = await request.formData();
//     console.log("Valeurs du formulaire avant envoi :", data);
//     // const data = Object.fromEntries(formData); // Convert FormData to a plain object
//     console.log(localStorage.getItem('token'));
//     const dataAuth = {
//         Matricule: data.get('Matricule'),
//         Nom: data.get('Nom'),
//         Prénom: data.get('Prénom'),
//         Date_Naissance: data.get('Date_Naissance'),
//         Age: Number(data.get('Age')),
//         Ancienneté: Number(data.get('Ancienneté')),
//         Sexe: data.get('Sexe'),
//         CSP: data.get('CSP'),
//         Fonction: data.get('Fonction'),
//         Echelle: data.get('Echelle'),
//         CodeFonction: Number(data.get('CodeFonction')),
//         Id_direction: "DIR001"
//     }
//     console.log(dataAuth);
//     const response = await fetch(`http://127.0.0.1:8000/api/employes/new`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify(dataAuth),
//     });
//     console.log('Response Status:', response.status); // Log the status code
//     console.log('Response OK:', response.ok); // Log whether the response is OK
//     if (!response.ok) {
//         throw new Response(JSON.stringify({ message: ' Error user can not created ' }), { status: 500 });
//     }
    
//     return redirect('/homePage');
    
// };