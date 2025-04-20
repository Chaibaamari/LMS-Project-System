import { TBF } from "@/assets/modelData";
import { createSlice } from "@reduxjs/toolkit";

type TBFType = {
    TBFData: TBF[]
    IsLoading: boolean
    refrechData: boolean,
    Notification: {
        IsVisible: boolean,
        status: string,
        message : string,
    }
}
const initialState: TBFType = {
    TBFData: [],
    IsLoading: false,
    refrechData:false,
    Notification: {
        IsVisible : false,
        status: "",
        message : "",
    },
}


const TBFSlice = createSlice({
    name: "TBF",
    initialState, 
    reducers: {
        FetchDataTBF(state, action) {
            state.TBFData = action.payload;
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

export default TBFSlice;
export const   TBFActions = TBFSlice.actions;