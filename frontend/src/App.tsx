import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home  from './pages/Home'
import LoginPage from "./pages/JWT/Login";
import { action as loginAction } from "./pages/JWT/Login";
import { action as LogoutAction} from './pages/JWT/Logout'
import PageError from "./pages/Error/pageError";
import { LoadToken, ProtectedRoute } from "./util/Auth";
import Sidebar from "./pages/RootLayout";
import PlanPrevision from "./pages/PlanPrevision/PlanPrevision";
import PlanNotifie from "./pages/PlanNotifé/PlanNotifie";
import BonCommand from "./pages/BondCommand/BonCommand";
import Settings from "./pages/JWT/Settings";
import Employee from "./pages/Employe/Employe-Section";
import Direction from "./pages/direction-Section";
import EmployeFormUpdate from "./pages/Employe/UpdateEmploye";
import EmployeFormInsert from "./pages/Employe/InsertEmploye";
import InsertPrevision from "./pages/PlanPrevision/InsertPrevision";
import PlanPrevisionFormUpdate from "./pages/PlanPrevision/UpdatePlanPrevision";
import PlanNotifieeFormInsert from "./pages/PlanNotifé/InsertNotifee";
import PlanNotifieeFormUpdate from "./pages/PlanNotifé/UpdatePlanNotifee";
import BondCommandDetailPage from "./pages/BondCommand/bondCommandDetail";

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
          id: "root",
          loader: LoadToken,
          children: [
            { index: true, element: <Home />, loader: ProtectedRoute },
            { path: 'Employee', element: <Employee />, loader: ProtectedRoute },
            { path: 'Direction', element: <Direction />, loader: ProtectedRoute },
            { path: 'planPrevision', element: <PlanPrevision />, loader: ProtectedRoute },
            { path: 'planNotifie', element: <PlanNotifie />, loader: ProtectedRoute },
            {
              path: 'bondCommand', element: <BonCommand />, loader: ProtectedRoute
            },
            { path: 'Settings', element: <Settings />, loader: ProtectedRoute },
          ]
        },
        { path: 'Emp/update/:matricule', element: <EmployeFormUpdate />, loader: ProtectedRoute },
        { path: 'prev/update/:ID_N', element: <PlanPrevisionFormUpdate />, loader: ProtectedRoute },
        { path: 'notifie/update/:ID_N', element: <PlanNotifieeFormUpdate />, loader: ProtectedRoute },
        { path: 'Emp/insert', element: <EmployeFormInsert />, loader: ProtectedRoute },
        { path: 'homePage/bondCommand/:id', element: <BondCommandDetailPage /> },
        { path: 'Emp/insert', element: <EmployeFormInsert />, loader: ProtectedRoute },
        { path: 'PrevPlan/insert', element: <InsertPrevision />, loader: ProtectedRoute },
        { path: 'NotifieePlan/insert', element: <PlanNotifieeFormInsert />, loader: ProtectedRoute },
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

