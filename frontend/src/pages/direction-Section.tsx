
    // const [Directions, setDirections] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [Error , setError] = useState(null)

    // const token = getAuthToken();
    // useEffect(() => {
    //     setIsLoading(true);
    //     const fetchData = async () => {
    //         const response = await fetch("http://127.0.0.1:8000/api/directions", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 'Accept': 'application/json',
    //                 "Authorization": `Bearer ${token}` // Include the token in the request
    //             }
    //         });
    //         const data = await response.json();
    //         setDirections(data.directions);
    //         return data.employes;
    //     };

        
    //     fetchData();
    //     setIsLoading(false)
    // }, [token]);

import EnhancedRole from "@/components/Role"
import EnhancedPrévisionsTotal from "@/components/PrévisionsTotal"
import EnhancedPrévisions from "@/components/Prévisions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Card, CardContent } from "@/components/ui/card"

export default function Direction()  {
    return (
        <div className="flex w-full flex-col">
            <Tabs defaultValue="total" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="total">Les Statistiques Générales</TabsTrigger>
                    <TabsTrigger value="prévision">Les Statistiques Des Prévisions</TabsTrigger>
                </TabsList>
                <TabsContent value="total">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <EnhancedRole />
                                <EnhancedPrévisionsTotal />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="prévision">
                    <Card>
                        <CardContent className="pt-6">
                            <EnhancedPrévisions />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
