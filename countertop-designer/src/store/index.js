// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import counterTopReducer from './slices/counterTopSlice';

export const store = configureStore({
    reducer: {
        counterTop: counterTopReducer
    }
});
