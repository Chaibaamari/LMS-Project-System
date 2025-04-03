import { PlanPrevision } from "@/assets/modelData";
import { createSlice } from "@reduxjs/toolkit";



interface PlanPrevisionState {
    ListePrevision: PlanPrevision[];
    notification: {
        IsVisible:boolean,
        status: string,
        message : string,
    }
    IsLoading:boolean,
    refrechData: boolean,
    ListeIntitulAction : string[],
}

const initialState: PlanPrevisionState = {
    ListePrevision: [],
    notification: {
        IsVisible : false,
        status: '',
        message:'',
    },
    IsLoading : false,
    refrechData: false,
    ListeIntitulAction : []
};

const PrevisionPlanSlice = createSlice({
    name: "PlanPrevision",
    initialState,
    reducers: {
        FetchDataPrevision(state, action) {
            state.ListePrevision = action.payload;
        },
        ShowNotification(state, action) {
            state.notification = {
                IsVisible : action.payload.IsVisible,
                status: action.payload.status,
                message : action.payload.message,
            }
        },
        ClearNotification(state) {
            state.notification = {
                IsVisible : false,
                status: '',
                message : '',
            }
            state.refrechData = false
        },
        ReferchLatestData(state , action) {
            state.refrechData = action.payload.refrechData
        },
        ShowNotificationRefrech(state , action) {
            state.IsLoading = action.payload;
        },
        GetAllFormation(state, action) {
            state.ListeIntitulAction = action.payload;
        }
    }
});

export default PrevisionPlanSlice;
export const PrevisionActions = PrevisionPlanSlice.actions;
