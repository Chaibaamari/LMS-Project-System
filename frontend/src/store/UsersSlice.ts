// src/store/UsersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    name: string;
    email: string;
    // أضف أي خصائص ثانية حسب البيانات
}

interface NotificationDelete {
    IsVisible: boolean;
    status: "pending" | "success" | "failed" | "";
    message: string;
}

interface UsersState {
    users: User[];
    refrechData: boolean;
    notificationDelete: NotificationDelete;
}

const initialState: UsersState = {
    users: [],
    refrechData: false,
    notificationDelete: {
        IsVisible: false,
        status: "",
        message: "",
    },
};

const UsersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        FetchDataUsers(state, action: PayloadAction<User[]>) {
            state.users = action.payload;
        },
        ToggleRefrechData(state) {
            state.refrechData = !state.refrechData;
        },
        SetNotificationDelete(state, action: PayloadAction<NotificationDelete>) {
            state.notificationDelete = action.payload;
        },
        ClearNotificationDelete(state) {
            state.notificationDelete = {
                IsVisible: false,
                status: "",
                message: "",
            };
        },
    },
});

export const UserActions = UsersSlice.actions;
export default UsersSlice.reducer;
