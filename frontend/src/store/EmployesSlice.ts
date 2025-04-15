import { Users } from "@/assets/modelData";
import { createSlice } from "@reduxjs/toolkit";



interface EmployeesState {
    employees: Users[];
    notification: {
        IsVisible:boolean,
        status: string,
        message : string,
    }
    refrechData: boolean,
    IsLoading:boolean,
}

const initialState: EmployeesState = {
    employees: [],
    notification: {
        IsVisible : false,
        status: '',
        message:'',
    },
    refrechData: false,
    IsLoading : false,
};

const EmployeeSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {
        FetchDataEmployee(state, action) {
            state.employees = action.payload;
        },
        ShowNotification(state, action) {
            state.notification = {
                IsVisible : action.payload.IsVisible,
                status: action.payload.status,
                message : action.payload.message,
            }
        },
        ClearNotification(state) {
            state.notification = {
                IsVisible : false,
                status: '',
                message : '',
            }
            state.refrechData = false
        },
        ShowNotificationRefrech(state , action) {
            state.IsLoading = action.payload;
        },
        ReferchLatestData(state , action) {
            state.refrechData = action.payload.refrechData
        }
    }
});

export default EmployeeSlice;
export const EmployeeActions = EmployeeSlice.actions;
