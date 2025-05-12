import { Formation, FormationEnCours } from "@/assets/modelData";
import { createSlice } from "@reduxjs/toolkit";



type FormationType = {
    FormationData: Formation[]
    FormationEnCours: FormationEnCours[]
    IsLoading: boolean
    refrechData: boolean,
    Notification: {
        IsVisible: boolean,
        status: string,
        message : string,
    }
}
const initialState: FormationType = {
    FormationData: [],
    FormationEnCours : [],
    IsLoading: false,
    refrechData:false,
    Notification: {
        IsVisible : false,
        status: "",
        message : "",
    },
}


const FormationSlice = createSlice({
    name: "Formation",
    initialState, 
    reducers: {
        FetchDataFormation(state, action) {
            state.FormationData = action.payload;
        },
        FetchDataFormationEnCours(state, action) {
            state.FormationEnCours = action.payload;
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

export default FormationSlice;
export const   FormationActions = FormationSlice.actions;