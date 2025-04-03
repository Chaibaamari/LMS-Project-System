import { Users } from "@/assets/modelData";
import { createSlice } from "@reduxjs/toolkit";



interface EmployeesState {
    employees: Users[];
    notificationDelete: {
        IsVisible:boolean,
        status: string,
        message : string,
    }
    refrechData:boolean,
}

const initialState: EmployeesState = {
    employees: [],
    notificationDelete: {
        IsVisible : false,
        status: '',
        message:'',
    },
    refrechData :false,
};

const EmployeeSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {
        FetchDataEmployee(state, action) {
            state.employees = action.payload;
        },
        ShowNotificationDelete(state, action) {
            state.notificationDelete = {
                IsVisible : action.payload.IsVisible,
                status: action.payload.status,
                message : action.payload.message,
            }
        },
        ClearNotificationDelete(state) {
            state.notificationDelete = {
                IsVisible : false,
                status: '',
                message : '',
            }
            state.refrechData = false
        },
        ReferchLatestData(state , action) {
            state.refrechData = action.payload.refrechData
        }
    }
});

export default EmployeeSlice;
export const EmployeeActions = EmployeeSlice.actions;
