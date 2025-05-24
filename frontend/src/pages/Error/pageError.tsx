import { useRouteError } from "react-router-dom";
import PageContentError from "../../components/Error/PageContentError";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/indexD";
import { ErrorActions } from "@/store/ErrorSlice";
import { useEffect } from "react";

function PageError() {
    const dispatch = useDispatch<AppDispatch>();
    const { title ,status  ,message} = useSelector((state : RootState) => state.Errors.notification);
    const error = useRouteError() as { status?: number; data?: { message?: string } }; // ✅ Made it more flexible

    useEffect(() => {
        if (!error) return;
    
        switch (error.status) {
            case 400:
                dispatch(ErrorActions.ShowNotification({
                    title: "Requête invalide",
                    status: "400",
                    message: "La requête envoyée est invalide.",
                }));
                break;
            case 401:
                dispatch(ErrorActions.ShowNotification({
                    title: "Non autorisé",
                    status: "401",
                    message: "Vous devez être connecté pour accéder à cette ressource.",
                }));
                break;
            case 403:
                dispatch(ErrorActions.ShowNotification({
                    title: "Accès interdit",
                    status: "403",
                    message: "Vous n'avez pas les permissions nécessaires.",
                }));
                break;
            case 404:
                dispatch(ErrorActions.ShowNotification({
                    title: "Page introuvable",
                    status: "404",
                    message: "La ressource demandée est introuvable.",
                }));
                break;
            case 408:
                dispatch(ErrorActions.ShowNotification({
                    title: "Temps dépassé",
                    status: "408",
                    message: "Le serveur a mis trop de temps à répondre.",
                }));
                break;
            case 422:
                dispatch(ErrorActions.ShowNotification({
                    title: "Erreur de validation",
                    status: "422",
                    message: error?.data?.message || "Les données envoyées sont incorrectes.",
                }));
                break;
            case 429:
                dispatch(ErrorActions.ShowNotification({
                    title: "Trop de requêtes",
                    status: "429",
                    message: "Trop de tentatives. Réessayez plus tard.",
                }));
                break;
            case 500:
                dispatch(ErrorActions.ShowNotification({
                    title: "Erreur serveur",
                    status: "500",
                    message: error?.data?.message || "Une erreur interne est survenue.",
                }));
                break;
            case 503:
                dispatch(ErrorActions.ShowNotification({
                    title: "Service indisponible",
                    status: "503",
                    message: "Le serveur est temporairement indisponible.",
                }));
                break;
            default:
                dispatch(ErrorActions.ShowNotification({
                    title: "Erreur inconnue",
                    status: error?.status?.toString() || "???",
                    message: error?.data?.message || "Une erreur inattendue s'est produite.",
                }));
                break;
        }
    }, [dispatch, error]);

    return (
        <PageContentError
            status={status}
            title={title}
            message={message}
        />
    );
}

export default PageError;
