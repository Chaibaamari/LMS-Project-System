import { configureStore } from '@reduxjs/toolkit';
import EmployeeSlice from './EmployesSlice';
import PrevisionPlanSlice from './PrevisionSlice';
import ErrorPageSlice from './ErrorSlice';
import PlanNotifeeSlice from './NotifeSlice';
import BondCommandSlice from './BondCommand';
import FormationSlice from './Formation';
import TBFSlice from './TBF';
import DirectionsSlice from './Directions';
import OrganismeSlice from './Organisme';
import SettigSlice from './setting';




export const store = configureStore({
    reducer: {
        employees: EmployeeSlice.reducer,
        PlanPrevision: PrevisionPlanSlice.reducer,
        Errors : ErrorPageSlice.reducer,
        PlanNotifee: PlanNotifeeSlice.reducer,
        BondCommand: BondCommandSlice.reducer,
        Formation: FormationSlice.reducer,
        TBF: TBFSlice.reducer,
        Direction: DirectionsSlice.reducer,
        Organisme: OrganismeSlice.reducer,
        Setting:SettigSlice.reducer,
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

