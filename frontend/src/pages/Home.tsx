import UsersTable from "@/components/Tables/employes-table";
import { getAuthToken } from "@/util/Auth";
import { useEffect , useState } from "react";



function EmployeeTestPage() {
    const [token] = useState(localStorage.getItem('token') || ''); // Get token from storage
    const [employes, setEmployes] = useState([]);

    useEffect(() => {
    //     const CreateNewData = async ({ request :formData }) => {
    //         setIsLoading(true);
    //         setErrors({});
    //         setSuccess(false);
    //         const token = getAuthToken();
    //         const data = await request.formData();
    // // const data = Object.fromEntries(formData); // Convert FormData to a plain object
    //         const dataAuth = {
    //             Matricule: data.get('Matricule'),
    //             Nom: data.get('Nom'),
    //             Prénom: data.get('Prénom'),
    //             Date_Naissance: data.get('Date_Naissance'),
    //             Age: data.get('Age'),
    //             Ancienneté: data.get('Ancienneté'),
    //             Sexe: data.get('Sexe'),
    //             CSP: data.get('CSP'),
    //             Fonction: data.get('Fonction'),
    //             Echelle: data.get('Echelle'),
    //             CodeFonction: data.get('CodeFonction'),
    //             Id_direction: "DIR001"
    //         };
    //         try {
    //             const response = await fetch("http://127.0.0.1:8000/api/employes/new", {
    //                 method: "POST",
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Accept': 'application/json',
    //                     "Authorization": `Bearer ${token}`
    //                 },
    //                 body: JSON.stringify(dataAuth),
    //             });

    //             if (!response.ok) {
    //                 const errorData = await response.json();
    //                 if (errorData.errors) {
    //                     setErrors(errorData.errors);
    //                 } else {
    //                     setErrors({ general: [errorData.message || 'Unknown error occurred'] });
    //                 }
    //                 return;
    //             }

    //             const data = await response.json();
    //             console.log('Success:', data);
    //             setSuccess(true);
    //         } catch (error) {
    //             console.error('API Request Failed:', error);
    //             setErrors({ general: ['Network error or server unavailable'] });
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
        const fetchData = async () => {
            const token = getAuthToken();
            const response = await fetch("http://127.0.0.1:8000/api/employes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}` // Include the token in the request
                }
            });
            const data = await response.json();
            console.log(data.employes);
            setEmployes(data.employes);
            return data.employes;
        };

        
        fetchData();
        // CreateNewData();
    }, [token]);

    return (
        <>         
            <UsersTable data={employes} />
        </>
    );
}

export default EmployeeTestPage;


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