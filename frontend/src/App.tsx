import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home  from './pages/Home'
import LoginPage from "./pages/Login";
import { action as loginAction } from "./pages/Login";
import { action as LogoutAction} from './pages/Logout'
import PageError from "./pages/pageError";
import { ProtectedRoute } from "./util/Auth";
import Sidebar from "./pages/RootLayout";
import PlanPrevision from "./pages/PlanPrevision";
import PlanNotifie from "./pages/PlanNotifie";
import BonCommand from "./pages/BonCommand";
import Settings from "./pages/Settings";

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
          loader : ProtectedRoute,
          children: [
            { index:true, element: <Home /> },
            { path: 'planPrevision', element: <PlanPrevision/> },
            { path: 'planNotifie', element: <PlanNotifie/> },
            { path: 'Bon-de-command', element: <BonCommand/> },
            { path: 'Settings', element: <Settings/> },
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

