import { PlanNotifee } from "@/assets/modelData";
import { createSlice } from "@reduxjs/toolkit";

type PLanNotifeeType = {
    PlanNotifeeData: PlanNotifee[]
    IsLoading: boolean
    refrechData: boolean,
    Notification: {
        IsVisible: boolean,
        status: string,
        message : string,
    }
    ListeIntitulAction: {
        value: number;
        label: string;
    }[],
}
const initialState: PLanNotifeeType = {
    PlanNotifeeData: [],
    IsLoading: false,
    refrechData:false,
    Notification: {
        IsVisible : false,
        status: "",
        message : "",
    },
    ListeIntitulAction:[],
}


const PlanNotifeeSlice = createSlice({
    name: "PlanNotifee",
    initialState, 
    reducers: {
        FetchDataPlanNotifee(state, action) {
            state.PlanNotifeeData = action.payload.PlanNotifeeData;
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
        GetAllFormation(state, action) {
            state.ListeIntitulAction = action.payload;
        }
    }
})

export default PlanNotifeeSlice;
export const   NotifeeActions = PlanNotifeeSlice.actions;