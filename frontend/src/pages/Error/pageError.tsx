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
        if (error?.status === 500 && error?.data?.message) {
            dispatch(ErrorActions.ShowNotification({
                title: "Server Error",
                status: "500",
                message: error.data.message,
            }));
        } else if (error?.status === 404) {
            dispatch(ErrorActions.ShowNotification({
                title: "Page Not Found",
                status: "404",
                message: "The requested resource could not be found.",
            }));
        } else if (error?.status === 422 && error?.data?.message) {
            dispatch(ErrorActions.ShowNotification({
                title: "Error",
                status: "422",
                message: error.data.message,
            }));
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
