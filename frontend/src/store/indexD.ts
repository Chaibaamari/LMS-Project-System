import { configureStore } from '@reduxjs/toolkit';
import EmployeeSlice from './EmployesSlice';
import PrevisionPlanSlice from './PrevisionSlice';
import ErrorPageSlice from './ErrorSlice';
import PlanNotifeeSlice from './NotifeSlice';



export const store = configureStore({
    reducer: {
        employees: EmployeeSlice.reducer,
        PlanPrevision: PrevisionPlanSlice.reducer,
        Errors : ErrorPageSlice.reducer,
        PlanNotifee : PlanNotifeeSlice.reducer,
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

