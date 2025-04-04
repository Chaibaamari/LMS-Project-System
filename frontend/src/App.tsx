import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home  from './pages/Home'
import LoginPage from "./pages/Login";
import { action as loginAction } from "./pages/Login";
import { action as LogoutAction} from './pages/Logout'
import PageError from "./pages/Error/pageError";
import { LoadToken, ProtectedRoute } from "./util/Auth";
import Sidebar from "./pages/RootLayout";
import PlanPrevision from "./pages/PlanPrevision/PlanPrevision";
import PlanNotifie from "./pages/PlanNotifie";
import BonCommand from "./pages/BonCommand";
import Settings from "./pages/Settings";
import Employee from "./pages/Employe/Employe-Section";
import Direction from "./pages/direction-Section";
import EmployeFormUpdate from "./pages/Employe/Employe-Form";
import EmployeFormInsert from "./pages/Employe/InsertEmploye";
import InsertPrevision from "./pages/PlanPrevision/InsertPrevision";

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
          id:"root",
          loader: LoadToken,
          // loader: ProtectedRoute,
          children: [
            { index: true, element: <Home /> , loader: ProtectedRoute },
            { path: 'Employee', element: <Employee /> , loader: ProtectedRoute },
            { path: 'Direction', element: <Direction /> , loader: ProtectedRoute },
            { path: 'planPrevision', element: <PlanPrevision /> , loader: ProtectedRoute },
            { path: 'planNotifie', element: <PlanNotifie /> , loader: ProtectedRoute },
            { path: 'Bon-de-command', element: <BonCommand /> , loader: ProtectedRoute },
            { path: 'Settings', element: <Settings /> , loader: ProtectedRoute },
          ]
        },
        { path: 'Emp/update/:matricule', element: <EmployeFormUpdate /> , loader: ProtectedRoute },
        { path: 'Emp/insert', element: <EmployeFormInsert /> ,  loader: ProtectedRoute },
        { path: 'PrevPlan/insert', element: <InsertPrevision /> ,  loader: ProtectedRoute },
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

