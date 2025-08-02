import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: [],
    loading: false,
    error: null,
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            // save userinfo in asyncStorage
            AsyncStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        // petInfo: (state, action) => {
        //     state.userInfo = action.payload;
        //     // save petinfo in asyncStorage
        //     AsyncStorage.setItem('petInfo', JSON.stringify(action.payload));
        // },
        logout: (state) => {
            state.userInfo = [];
            // remove user and petinfo from asyncStorage when logged out
            AsyncStorage.removeItem('userInfo');
            // AsyncStorage.removeItem('petInfo');
        }
    }
})

export const { setCredentials, logout } = globalSlice.actions;

export default globalSlice.reducer;