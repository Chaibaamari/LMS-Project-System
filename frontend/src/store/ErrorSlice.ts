import { createSlice } from "@reduxjs/toolkit";



interface ErrorState {
    notification: {
        title:string,
        status: string,
        message : string,
    }
}

const initialState: ErrorState = {
    notification: {
        title:"",
        status: "",
        message : "",
    }
};

const ErrorPageSlice = createSlice({
    name: "ErrorPageSlice",
    initialState,
    reducers: {
        ShowNotification(state, action) {
            state.notification = {
                title: action.payload.title,
                status: action.payload.status,
                message : action.payload.message,
            }
        },
        ClearNotification(state) {
            state.notification = {
                title: "",
                status: "",
                message : "",
            }
        },
    }
});

export default ErrorPageSlice;
export const ErrorActions = ErrorPageSlice.actions;
