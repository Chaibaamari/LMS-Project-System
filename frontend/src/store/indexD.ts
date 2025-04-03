import { configureStore } from '@reduxjs/toolkit';
import EmployeeSlice from './EmployesSlice';



export const store = configureStore({
    reducer: {
        employees: EmployeeSlice.reducer ,
        // Add other reducers here as needed
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

