import { createSlice } from "@reduxjs/toolkit";

type BondCommandType = {
    IsLoading: boolean
    refrechData: boolean,
    Notification: {
        IsVisible: boolean,
        status: string,
        message : string,
    }
}
const initialState: BondCommandType = {
    IsLoading: false,
    refrechData:false,
    Notification: {
        IsVisible : false,
        status: "",
        message : "",
    },

}


const SettigSlice = createSlice({
    name: "Setting",
    initialState, 
    reducers: {
        ShowNotificationRefrech(state , action) {
            state.IsLoading = action.payload;
        },
        ShowNotification(state, action) {
            state.Notification = {
                IsVisible : action.payload.IsVisible,
                status: action.payload.status,
                message : action.payload.message,
            }
        },
        ClearNotification(state) {
            state.Notification = {
                IsVisible : false,
                status: '',
                message : '',
            }
            state.refrechData = false
        },
        ReferchLatestData(state , action) {
            state.refrechData = action.payload.refrechData
        },
    }
})

export default SettigSlice;
export const  SettingActions = SettigSlice.actions;