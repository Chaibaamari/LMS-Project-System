import { useRouteError } from "react-router-dom";
import PageContentError from "../components/Error/PageContentError";

function PageError() {
    const error = useRouteError() as { status?: number; data?: { message?: string } }; // ✅ Made it more flexible

    let title: string = "An error occurred!";
    let message: string = "Something went wrong!";

    if (error?.status === 500 && error?.data?.message) {
        title = "Server Error";
        message = error.data.message; // ✅ Now message always gets a value
    } else if (error?.status === 404) {
        title = "Page Not Found";
        message = "The requested resource could not be found.";
    }
    if (error?.status === 422 && error?.data?.message) {
        title =  "Error";
        message = error.data.message; // ✅ Now message always gets a value
    }

    console.log(error?.status); // ✅ Added optional chaining to prevent crashes

    return (
        <PageContentError title={title}>
            <p>{message}</p>
        </PageContentError>
    );
}

export default PageError;
