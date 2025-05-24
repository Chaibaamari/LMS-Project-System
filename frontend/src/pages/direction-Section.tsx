
import NotificationError from "@/components/Error/NotificationError";
import { DirectionCards } from "@/components/Tables/Table-direction";
import { DirectionsActions } from "@/store/Directions";
import { AppDispatch, RootState } from "@/store/indexD";
import { getAuthToken } from "@/util/Auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Direction() { 
    const dispatch = useDispatch<AppDispatch>();
    const DirectionsData = useSelector((state: RootState) => state.Direction.DirectionsData) 
    const refrechData = useSelector((state: RootState) => state.Direction.refrechData);
    const IsLoading = useSelector((state: RootState) => state.Direction.IsLoading);
    const {IsVisible , status , message} = useSelector((state : RootState) => state.Direction.Notification)
    const token = getAuthToken();

    useEffect(() => {
            const SendDirectionsData = async () => {
                dispatch(DirectionsActions.ShowNotificationRefrech(true));
                const response = await fetch("http://127.0.0.1:8000/api/directions", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json',
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await response.json();
                dispatch(DirectionsActions.FetchDataDirections(data.directions));
                dispatch(DirectionsActions.ShowNotificationRefrech(false));
            }
            SendDirectionsData()
    }, [dispatch, token, refrechData]);
    useEffect(() => {
            if (IsVisible) {
                setTimeout(() => {
                    dispatch(DirectionsActions.ClearNotification());
                }, 5000)
            }
        }, [dispatch, IsVisible]);
    return (
        <main className="container mx-auto py-10 px-4">
            {IsLoading ?
                (<>
                    <div className="flex flex-col md:flex-row items-center mb-8">
                        <div className="flex items-center mb-4 md:mb-0">
                            <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                        </div>
                        <div className="text-center md:text-start font-raleway">
                            <h1 className="text-3xl md:text-3xl font-bold tracking-tight">
                                DSI Directions
                            </h1>
                        </div>
                    </div>
                    <DirectionCards data={[]} />
                </>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row items-center mb-8">
                            <div className="flex items-center mb-4 md:mb-0">
                                <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                            </div>
                            <div className="text-center md:text-start font-raleway">
                                <h1 className="text-3xl md:text-3xl font-bold tracking-tight">
                                    DSI Directions
                                </h1>
                            </div>
                        </div>
                        <DirectionCards data={DirectionsData} />
                        <NotificationError
                            isVisible={IsVisible}
                            status={status}
                            message={message}
                        />
                    </>)}
        </main>
    );
}