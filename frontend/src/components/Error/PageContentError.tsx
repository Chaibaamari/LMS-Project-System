

import { ArrowLeft, HomeIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


const PageContentError: React.FC<{ title: string; status: string; message: string }> = (props) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 ">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-sonatrachColor p-6 text-white">
                    <h1 className="text-5xl font-bold">{props.status}</h1>
                    <p className="text-xl mt-2">{props.message}</p>
                </div>

                <div className="p-8">
                    <p className="text-gray-600 mb-6">
                        <span>{props.title}</span>
                        We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL was
                        mistyped.
                        <br />
                    </p>
                    

                    {/* Navigation buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={18} />
                            Go Back
                        </button>
                        <Link to="/homePage">
                        <button
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-sonatrachColor text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            <HomeIcon size={18} />
                            Return Home
                        </button>
                        </Link>
                    </div>
                </div>

                {/* Error tracking */}
                <div className="bg-gray-100 p-4 text-center text-sm text-gray-500 border-t">
                    Error code: { props.status} | This page has been reported to our team.
                </div>
            </div>
        </div>
    );
}

export default PageContentError;
