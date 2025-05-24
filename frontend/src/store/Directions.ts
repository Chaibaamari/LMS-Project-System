import { Direction } from "@/assets/modelData";
import { createSlice } from "@reduxjs/toolkit";

type DirectionsType = {
    DirectionsData: Direction[]
    IsLoading: boolean
    refrechData: boolean,
    Notification: {
        IsVisible: boolean,
        status: string,
        message: string,
    }
}
const initialState: DirectionsType = {
    DirectionsData: [],
    IsLoading: false,
    refrechData:false,
    Notification: {
        IsVisible : false,
        status: "",
        message : "",
    },
}


const DirectionsSlice = createSlice({
    name: "Directions",
    initialState, 
    reducers: {
        FetchDataDirections(state, action) {
            state.DirectionsData = action.payload;
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

export default DirectionsSlice;
export const   DirectionsActions = DirectionsSlice.actions;