import { redirect } from "react-router-dom";
export const action = () => {
    localStorage.removeItem('token');
    // localStorage.removeItem('emailUser');
    return redirect('/?mode=login');
}