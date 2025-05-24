import { createSlice } from "@reduxjs/toolkit";

type FormationType = {
    IsLoading: boolean
    refrechData: boolean,
    Notification: {
        IsVisible: boolean,
        status: string,
        message : string,
    }
    ListeOrganisme: {
        value: number;
        label: string;
    }[],
}
const initialState: FormationType = {
    IsLoading: false,
    refrechData:false,
    Notification: {
        IsVisible : false,
        status: "",
        message : "",
    },
    ListeOrganisme:[],
}


const OrganismeSlice = createSlice({
    name: "Formation",
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
        GetAllOrganisme(state, action) {
            state.ListeOrganisme = action.payload;
        }
    }
})

export default OrganismeSlice;
export const   OrganismeActions = OrganismeSlice.actions;