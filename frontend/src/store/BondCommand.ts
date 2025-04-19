import { BondCommand } from "@/assets/modelData";
import { createSlice } from "@reduxjs/toolkit";

type BondCommandType = {
    BondCommandData: BondCommand[]
    IsLoading: boolean
    refrechData: boolean,
    Notification: {
        IsVisible: boolean,
        status: string,
        message : string,
    }
}
const initialState: BondCommandType = {
    BondCommandData: [],
    IsLoading: false,
    refrechData:false,
    Notification: {
        IsVisible : false,
        status: "",
        message : "",
    },
}


const BondCommandSlice = createSlice({
    name: "BondCommand",
    initialState, 
    reducers: {
        FetchDataPlanNotifee(state, action) {
            state.BondCommandData = action.payload;
        },
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

export default BondCommandSlice;
export const   BondCommandActions = BondCommandSlice.actions;