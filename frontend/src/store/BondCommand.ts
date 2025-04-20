import { BondCommand, currentUser } from "@/assets/modelData";
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
    User :currentUser,
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
    User: {
        name: "",
        email: "",
    }
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
        updateUser(state , action) {
            state.User = action.payload
        }
    }
})

export default BondCommandSlice;
export const   BondCommandActions = BondCommandSlice.actions;