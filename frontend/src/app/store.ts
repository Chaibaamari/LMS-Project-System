import { Users } from '@/assets/modelData';
import { getAuthToken } from '@/util/Auth';
import { configureStore, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmployeesState {
    employees: Users[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: EmployeesState = {
    employees: [],
    status: 'idle',
    error: null,
};

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
    const token = getAuthToken();
    const response = await fetch("http://127.0.0.1:8000/api/employes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.employes;
});

export const updateEmployee = createAsyncThunk('employees/updateEmployee',
    async ({ matricule, employeeData }: { matricule: string; employeeData: Partial<Users> }) => {
        const token = getAuthToken();
        const response = await fetch(`http://127.0.0.1:8000/api/employes/edit/${matricule}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...employeeData,
                Id_direction: "DIR001"
            }),
        });
        const data = await response.json();
        return data;
    });

export const addEmployee = createAsyncThunk('employees/addEmployee',
    async (employeeData: Partial<Users>) => {
        const token = getAuthToken();
        const response = await fetch(`http://127.0.0.1:8000/api/employes/new`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                ...employeeData,
                Id_direction: "DIR001" // Default value as in your code
            }),
        });
        const data = await response.json();
        return data;
    });

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        // Add synchronous reducers here if needed
    },
    extraReducers(builder) {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Users[]>) => {
                state.status = 'succeeded';
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch employees';
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const updatedEmployee = action.payload;
                const index = state.employees.findIndex(e => e.Matricule === updatedEmployee.Matricule);
                if (index !== -1) {
                    state.employees[index] = { ...state.employees[index], ...updatedEmployee };
                }
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.employees.push(action.payload);
            });
    }
});

export const store = configureStore({
    reducer: {
        employees: employeesSlice.reducer ,
        // Add other reducers here as needed
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

