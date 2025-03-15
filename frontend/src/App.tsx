import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home'
import LoginPage from "./pages/Login";
import { action as loginAction } from "./pages/Login";
import { action as LogoutAction} from './pages/Logout'
import PageError from "./pages/pageError";
// import { ProtectedRoute } from "./util/Auth";
import Sidebar from "./pages/RootLayout";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "",
      errorElement: <PageError />,
      children: [
        { index: true, element: <LoginPage />, action: loginAction },
        {
          path: 'homePage',
          element: <Sidebar />,
          // loader : ProtectedRoute,
          children: [
            { index:true, element: <Home /> },
            { path: 'formation', element: <div>Formation</div> },
          ]
        },
        { path: "logout", action: LogoutAction }
      ]
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

