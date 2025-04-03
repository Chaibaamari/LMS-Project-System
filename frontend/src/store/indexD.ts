import { configureStore } from '@reduxjs/toolkit';
import EmployeeSlice from './EmployesSlice';
import PrevisionPlanSlice from './PrevisionSlice';



export const store = configureStore({
    reducer: {
        employees: EmployeeSlice.reducer,
        PlanPrevision : PrevisionPlanSlice.reducer,
        // Add other reducers here as needed
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

