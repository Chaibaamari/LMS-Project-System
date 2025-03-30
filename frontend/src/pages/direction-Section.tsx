import { getAuthToken } from "@/util/Auth";
import { useEffect, useState } from "react";

function Direction() {
    const [Directions, setDirections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [Error , setError] = useState(null)

    const token = getAuthToken();
    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            const response = await fetch("http://127.0.0.1:8000/api/directions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}` // Include the token in the request
                }
            });
            const data = await response.json();
            setDirections(data.directions);
            return data.employes;
        };

        
        fetchData();
        setIsLoading(false)
    }, [token]);

    return (
        <>         
            <h1 className="text-center">direction section</h1>
        </>
    );
}

export default Direction;
