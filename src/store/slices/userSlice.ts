import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    createdAt: string;
}

interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    isLoading: false,
    error: null,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        clearUser: (state) => {
            state.user = null;
        },
        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setUserError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});
export const { setUser, updateUser, clearUser, setUserLoading, setUserError } = userSlice.actions;
export default userSlice.reducer;