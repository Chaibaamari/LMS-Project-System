import { PlanPrevision } from "@/assets/modelData";
import { createSlice } from "@reduxjs/toolkit";

interface ImportError {
  row: number;
  existence: string;
};

interface PlanPrevisionState {
    ListePrevision: PlanPrevision[];
    notification: {
        IsVisible:boolean,
        status: string,
        message : string,
    }
    importErrors: ImportError[] | null;
    importErrorCount: number;
    importErrorMessage: string | null;
    IsLoading:boolean,
    refrechData: boolean,
    ListeIntitulAction: {
        value: number;
        label: string;
    }[],
}

const initialState: PlanPrevisionState = {
    ListePrevision: [],
    notification: {
        IsVisible : false,
        status: '',
        message:'',
    },
    importErrors:  null,
    importErrorCount: 0,
    importErrorMessage: null,
    IsLoading : false,
    refrechData: false,
    ListeIntitulAction:[],

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
                IsVisible: action.payload.IsVisible,
                status: action.payload.status,
                message: action.payload.message,
            }
        },
        ClearNotification(state) {
            state.notification = {
                IsVisible: false,
                status: '',
                message: '',
            }
            state.refrechData = false
        },
        ReferchLatestData(state, action) {
            state.refrechData = action.payload.refrechData
        },
        ShowNotificationRefrech(state, action) {
            state.IsLoading = action.payload;
        },
        GetAllFormation(state, action) {
            state.ListeIntitulAction = action.payload;
        },
        SetImportErrors: (state, action) => {
            state.importErrors = action.payload.errors;
            state.importErrorCount = action.payload.totalRows;
            state.importErrorMessage = action.payload.message;
        },
        ClearImportErrors: (state) => {
            state.importErrors = null;
            state.importErrorCount = 0;
            state.importErrorMessage = null;
        }
    }
});

export default PrevisionPlanSlice;
export const PrevisionActions = PrevisionPlanSlice.actions;
